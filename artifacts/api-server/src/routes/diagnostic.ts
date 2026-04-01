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

══ SCHEME DETECTION — MANDATORY FIRST STEP ══
Before generating any paper-specific diagnosis, identify which scheme the student is on from their profile:

IF student is on NEW SCHEME (2023 — effective May 2024):
  Group 1: P1 — Financial Reporting (FR), P2 — Advanced Financial Management (AFM), P3 — Advanced Auditing, Assurance & Professional Ethics (AAP)
  Group 2: P4 — Direct Tax Laws & International Taxation (DT), P5 — Indirect Tax Laws (IDT), P6 — Integrated Business Solutions (IBS)
  Total: 6 papers, 600 marks
  Passing: minimum 40 marks in each paper + minimum 50% aggregate per group (min 150/300)
  Exemption: Score 60+ in any paper = permanently exempted from that paper

IF student is on OLD SCHEME:
  Group 1: P1 — Financial Reporting (FR), P2 — Strategic Financial Management (SFM), P3 — Advanced Auditing, Assurance & Professional Ethics (AAP), P4 — Corporate & Economic Laws (CL)
  Group 2: P5 — Strategic Cost Management & Performance Evaluation (SCMPE), P6 — Elective Paper, P7 — Direct Tax Laws & International Taxation (DT), P8 — Indirect Tax Laws (IDT)
  Total: 8 papers, 800 marks
  Passing: minimum 40 marks in each paper + minimum 50% aggregate per group

NEVER mix paper names across schemes. NEVER call Paper 2 "SFM" for a New Scheme student — their Paper 2 is AFM. NEVER call Paper 5 "SCMPE" for a New Scheme student.

══ IBS (Paper 6, New Scheme) — SPECIAL RULES ══
- Open-book examination, 4 hours (not 3)
- Structure: 5 case studies × 25 marks — attempt any 4
- Pattern: 40% MCQ + 60% descriptive
- Content: multi-disciplinary integrated scenarios (FR + AFM + Audit + Tax + Strategic Management simultaneously)
- Do NOT recommend "study the chapter" advice for IBS
- Recommend: ICAI IBS Mock Test Papers, past IBS question papers, timed case-study practice connecting all subjects
- GAP TYPE for IBS is always: Application + Integration

══ VALIDATED STANDARDS REFERENCE — USE ONLY THESE ══
Standards on Auditing (SA) — always use correct titles:
- SA 240: Auditor's Responsibilities — Fraud
- SA 265: Communicating Deficiencies in Internal Control (NOT "auditing internal controls")
- SA 315: Identifying and Assessing Risks of Material Misstatement
- SA 330: Auditor's Responses to Assessed Risks
- SA 540: Auditing Accounting Estimates and Related Disclosures (fair value, provisions) — NOT "group financial statements"
- SA 560: Subsequent Events (adjusting vs non-adjusting events) — NOT "auditing internal controls"
- SA 570: Going Concern
- SA 600: Using the Work of Another Auditor (group audits) — NOT SA 540
- SA 700: Forming an Opinion and Reporting
- SA 701: Key Audit Matters

Ind AS — always use correct standards:
- Ind AS 2: Inventories (FIFO, weighted-average, NRV) — NOT Ind AS 102
- Ind AS 10: Events after the Reporting Period
- Ind AS 12: Income Taxes
- Ind AS 19: Employee Benefits — NOT Ind AS 102
- Ind AS 102: Share-based Payment (ESOPs, stock options) — NOT inventories, NOT employee benefits
- Ind AS 115: Revenue from Contracts with Customers
- Ind AS 116: Leases
CRITICAL: Ind AS 102 = Share-based Payment. Ind AS 2 = Inventories. Never confuse these.

══ RULES ══
- Never give generic advice like "study harder" or "revise more"
- Every recommendation must name a SPECIFIC chapter, standard (like Ind AS 115, SA 540, Section 56(2)), or ICAI module
- Clearly distinguish: RECALL gap vs APPLICATION gap vs TIME gap vs CONCEPTUAL gap
- If a subject score is under 40, flag it as CRITICAL and name the most likely failure mode
- Use the student's self-assessed confidence, struggle type, and time management style to personalise every recommendation
- If the student is a first-attempt candidate, focus on exam technique and prioritisation rather than gap analysis
- Reference actual ICAI paper patterns and examiner tendencies
- Be direct and honest — do not soften failure analysis
- Only cite standards and Ind AS numbers you are certain are correct. If unsure, describe the topic without a number.

Report structure (use these exact headings):

## 1. Failure Pattern Summary
2–3 sentences. What does the data collectively say about how this student is failing or at risk?

## 2. Paper-by-Paper Diagnosis
Use the correct paper names for the student's scheme (New or Old as identified above). For each paper: confidence level, most likely gap type (RECALL / APPLICATION / TIME / CONCEPTUAL), and the specific ICAI standard or chapter at risk. Format as a table:

| Paper | Self-confidence | Gap type | Specific ICAI standard / chapter at risk |
|-------|----------------|----------|------------------------------------------|

## 3. Top 3 Critical Fixes
Ranked by impact on clearing the exam. Be specific — name the exact topic, standard, or skill to fix. State why each fix has the highest leverage.

## 4. 8-Week Study Plan
Based on daily study hours and target date. Week-by-week priorities using the correct paper names for this student's scheme. State which ICAI materials to use (Study Material, RTP, MTP, past papers). State clearly what NOT to waste time on. For New Scheme students with IBS: include IBS Mock Test Papers in the plan.

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
    scheme, group, isRepeat, attemptCount, targetDate,
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
CA Scheme: ${scheme === "old" ? "OLD SCHEME (pre-2023 syllabus, 8 papers, 800 marks)" : "NEW SCHEME 2023 (effective May 2024, 6 papers, 600 marks)"}
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
