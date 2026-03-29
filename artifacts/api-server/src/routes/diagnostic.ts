import { Router, type IRouter } from "express";
import { db, diagnosticsTable } from "@workspace/db";
import { AnalyzeDiagnosticBody, GetDiagnosticParams } from "@workspace/api-zod";
import OpenAI from "openai";
import { eq } from "drizzle-orm";

// Mercury 2 client — OpenAI-compatible API from Inception Labs
const mercury = new OpenAI({
  apiKey: process.env.INCEPTION_API_KEY ?? "missing",
  baseURL: "https://api.inceptionlabs.ai/v1",
});

const SYSTEM_PROMPT = `You are a CA Final exam diagnostic specialist with deep knowledge of the ICAI CA Final curriculum, past papers, RTPs, MTPs, and marking schemes.

Rules you must follow:
- Never give generic advice like "study harder" or "revise more"
- Every recommendation must name a SPECIFIC chapter, standard (like Ind AS 115, SA 706), or ICAI module
- Clearly distinguish: recall gaps vs application gaps vs time management gaps
- If a subject score is under 40, flag it as CRITICAL and name the most likely failure mode
- Be direct and honest — do not soften failure analysis
- Reference actual ICAI paper patterns and examiner tendencies

Report structure (use these exact headings):

## 1. Failure Pattern Summary
2–3 sentences. What does the data say about how this student is failing?

## 2. Paper-by-Paper Diagnosis
For each subject: what the score reveals, the most likely failure mode (recall/application/time), and the specific ICAI chapter or standard being missed.

## 3. Top 3 Critical Fixes
Ranked by impact on clearing the exam. Be specific — name the exact topic, standard, or skill to fix.

## 4. 8-Week Study Plan
Based on available daily study hours. Week-by-week priorities, subject order, and which ICAI materials to use (Study Material, RTP, MTP, past papers). State clearly what NOT to waste time on.

## 5. One Honest Call-Out
One thing this student currently believes about their preparation that is wrong — and the correct framing.`;

const router: IRouter = Router();

router.post("/diagnostic/analyze", async (req, res): Promise<void> => {
  const parsed = AnalyzeDiagnosticBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { name, email, examLevel, attemptNumber, subjects, weakAreas, studyHours } = parsed.data;
  const subjectsJson = JSON.stringify(subjects);

  const [diagnostic] = await db
    .insert(diagnosticsTable)
    .values({
      name,
      email,
      examLevel,
      attemptNumber,
      subjectsJson,
      weakAreas,
      studyHours: studyHours ?? null,
    })
    .returning();

  req.log.info({ diagnosticId: diagnostic.id }, "Diagnostic analysis started via Mercury 2");

  // Build structured student data string (mirrors the guide's format)
  const subjectLines = subjects
    .map((s: { subject: string; score?: number | null; maxScore: number }) => {
      const score = s.score != null ? `${s.score}/${s.maxScore}` : "Not attempted";
      const pct = s.score != null ? Math.round((s.score / s.maxScore) * 100) : 0;
      const status =
        s.score == null ? "Not attempted" : pct >= 40 ? "PASS" : "FAIL — CRITICAL";
      return `- ${s.subject}: ${score} (${status})`;
    })
    .join("\n");

  const studentData = `
Name: ${name}
CA Level: ${examLevel}
Attempt: ${attemptNumber}${attemptNumber === 1 ? "st" : attemptNumber === 2 ? "nd" : attemptNumber === 3 ? "rd" : "th"}
Daily study hours: ${studyHours ?? "Not specified"}

Subject scores (last attempt):
${subjectLines}

Self-reported weak areas: ${weakAreas.length > 0 ? weakAreas.join(", ") : "None specified"}
`.trim();

  const userPrompt = `Analyse this CA student and produce their full diagnostic report:\n\n${studentData}`;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  let fullReport = "";

  try {
    const stream = await mercury.chat.completions.create({
      model: "mercury-2",
      max_tokens: 3000,
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
