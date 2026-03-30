import { Router, type IRouter } from "express";
import { db, diagnosticsTable } from "@workspace/db";
import { AnalyzeDiagnosticBody, GetDiagnosticParams } from "@workspace/api-zod";
import OpenAI from "openai";
import { eq } from "drizzle-orm";

const mercury = new OpenAI({
  apiKey: process.env.INCEPTION_API_KEY ?? "missing",
  baseURL: "https://api.inceptionlabs.ai/v1",
});

const SYSTEM_PROMPT = `You are a CA Final exam diagnostic specialist with deep knowledge of the ICAI CA Final curriculum, past papers, RTPs, MTPs, and marking schemes.

Rules you must follow:
- Never give generic advice like "study harder" or "revise more"
- Every recommendation must name a SPECIFIC chapter, standard (like Ind AS 115, SA 706, Section 56(2)), or ICAI module
- Clearly distinguish: recall gaps vs application gaps vs time management gaps
- If a subject score is under 40, flag it as CRITICAL and name the most likely failure mode
- Use the student's self-assessed confidence, struggle type, and time management style to personalise every recommendation
- If the student is a first-attempt candidate, focus on exam technique and prioritisation rather than gap analysis
- Reference actual ICAI paper patterns and examiner tendencies
- Be direct and honest — do not soften failure analysis

Report structure (use these exact headings):

## 1. Failure Pattern Summary
2–3 sentences. What does the data collectively say about how this student is failing or at risk?

## 2. Paper-by-Paper Diagnosis
For each subject in the group: what the score/confidence reveals, the most likely failure mode (recall/application/time), and the specific ICAI chapter or standard at risk.

## 3. Top 3 Critical Fixes
Ranked by impact on clearing the exam. Be specific — name the exact topic, standard, or skill to fix. State why each fix has the highest leverage.

## 4. 8-Week Study Plan
Based on daily study hours and target date. Week-by-week priorities, subject order, and which ICAI materials to use (Study Material, RTP, MTP, past papers). State clearly what NOT to waste time on.

## 5. One Honest Call-Out
One thing this student currently believes about their preparation that is wrong — and the correct framing. Base this on their self-reported "main reason for not passing."`;

const router: IRouter = Router();

router.post("/diagnostic/analyze", async (req, res): Promise<void> => {
  const parsed = AnalyzeDiagnosticBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const {
    name, email, examLevel, attemptNumber, subjects, weakAreas, studyHours,
    group, isRepeat, attemptCount, targetDate,
    exemptions, attemptedAll, confidenceRatings,
    weakestChapters, struggleType, timeManagement,
    studyMethod, revisionMaterial, mainReason,
  } = parsed.data;

  const formDataJson = JSON.stringify(parsed.data);
  const subjectsJson = JSON.stringify(subjects ?? []);

  const [diagnostic] = await db
    .insert(diagnosticsTable)
    .values({
      name,
      email,
      examLevel: examLevel || (group ? `CA Final — ${group}` : "CA Final"),
      attemptNumber,
      subjectsJson,
      weakAreas: weakAreas ?? [],
      studyHours: studyHours ?? null,
      formDataJson,
    })
    .returning();

  req.log.info({ diagnosticId: diagnostic.id }, "Diagnostic analysis started via Mercury 2");

  // Build rich student profile for the AI
  const subjectLines = (subjects ?? [])
    .map(s => {
      const score = s.score != null ? `${s.score}/${s.maxScore}` : "Not attempted";
      const pct = s.score != null ? Math.round((s.score / s.maxScore) * 100) : 0;
      const status = s.score == null ? "Not attempted" : pct >= 40 ? "PASS" : "FAIL — CRITICAL";
      const exempt = exemptions?.includes(s.subject) ? " [EXEMPTION HELD]" : "";
      return `  - ${s.subject}: ${score} (${status})${exempt}`;
    })
    .join("\n");

  const confidenceLines = (confidenceRatings ?? [])
    .map(r => `  - ${r.subject}: ${r.rating}`)
    .join("\n");

  const studentProfile = `
=== CLARIX.AI STUDENT DIAGNOSTIC PROFILE ===

SECTION 1 — ATTEMPT PROFILE
Name: ${name}
CA Level: ${examLevel || `CA Final — ${group ?? "Unknown group"}`}
Group appearing for: ${group ?? examLevel ?? "Not specified"}
Attempt status: ${isRepeat ? `Repeater (${attemptCount ?? "?"} attempts so far)` : "First attempt"}
Target exam date: ${targetDate ?? "Not specified"}
Daily study hours: ${studyHours ?? "Not specified"}

SECTION 2 — LAST ATTEMPT SCORES${!isRepeat ? "\n  (First-time candidate — no prior attempt data)" : ""}
${subjectLines || "  No scores provided"}
Papers with exemption: ${exemptions && exemptions.length > 0 ? exemptions.join(", ") : "None"}
Attempted all questions in each paper: ${attemptedAll === "yes" ? "Yes" : attemptedAll === "some" ? "Some (left questions in certain papers)" : attemptedAll === "no" ? "No (did not attempt all)" : "Not specified"}

SECTION 3 — SELF-ASSESSED WEAK AREAS
Confidence by subject:
${confidenceLines || "  Not provided"}
Weakest subject — specific chapters/standards:
  ${weakestChapters || "Not specified"}
Struggle type: ${struggleType ?? "Not specified"}
Time management in mock tests: ${timeManagement ?? "Not specified"}
Self-reported weak areas: ${(weakAreas ?? []).length > 0 ? (weakAreas ?? []).join(", ") : "None specified"}

SECTION 4 — STUDY SETUP
Study method: ${studyMethod ?? "Not specified"}
Revision materials used: ${revisionMaterial && revisionMaterial.length > 0 ? revisionMaterial.join(", ") : "Not specified"}
Student's own diagnosis — biggest reason for not passing:
  "${mainReason ?? "Not provided"}"

===========================================`.trim();

  const userPrompt = `Analyse this CA Final student and produce their full diagnostic report:\n\n${studentProfile}`;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  let fullReport = "";

  try {
    const stream = await mercury.chat.completions.create({
      model: "mercury-2",
      max_tokens: 3500,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        fullReport += content;
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "AI analysis failed";
    req.log.error({ err }, "Mercury 2 stream error");
    res.write(`data: ${JSON.stringify({ error: msg })}\n\n`);
    res.end();
    return;
  }

  await db
    .update(diagnosticsTable)
    .set({ report: fullReport })
    .where(eq(diagnosticsTable.id, diagnostic.id));

  res.write(`data: ${JSON.stringify({ done: true, id: diagnostic.id })}\n\n`);
  res.end();
});

router.get("/diagnostic/:id", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetDiagnosticParams.safeParse({ id: rawId });
  if (!params.success) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  const [record] = await db
    .select()
    .from(diagnosticsTable)
    .where(eq(diagnosticsTable.id, params.data.id));

  if (!record) {
    res.status(404).json({ error: "Diagnostic not found" });
    return;
  }

  res.json({
    id: record.id,
    name: record.name,
    email: record.email,
    examLevel: record.examLevel,
    attemptNumber: record.attemptNumber,
    subjectsJson: record.subjectsJson,
    weakAreas: record.weakAreas,
    studyHours: record.studyHours,
    report: record.report,
    createdAt: record.createdAt.toISOString(),
  });
});

export default router;
