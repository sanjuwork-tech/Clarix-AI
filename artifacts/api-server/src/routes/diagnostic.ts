import { Router, type IRouter } from "express";
import { db, diagnosticsTable } from "@workspace/db";
import { AnalyzeDiagnosticBody, GetDiagnosticParams } from "@workspace/api-zod";
import { openai } from "@workspace/integrations-openai-ai-server";
import { eq } from "drizzle-orm";

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

  req.log.info({ diagnosticId: diagnostic.id }, "Diagnostic analysis started");

  const subjectsSummary = subjects
    .map((s: { subject: string; score?: number | null; maxScore: number }) => {
      const score = s.score != null ? `${s.score}/${s.maxScore}` : `Not attempted (max: ${s.maxScore})`;
      const pct = s.score != null ? Math.round((s.score / s.maxScore) * 100) : 0;
      const status = s.score == null ? "Not attempted" : pct >= 40 ? "Pass" : "FAIL";
      return `  - ${s.subject}: ${score} (${status}${s.score != null ? `, ${pct}%` : ""})`;
    })
    .join("\n");

  const systemPrompt = `You are an expert CA (Chartered Accountant) exam diagnostic AI built on ICAI's own material. You analyze CA students' exam performance with deep knowledge of:
- ICAI's exam patterns, marking schemes, and question types for Foundation, Intermediate, and Final levels
- Common failure patterns and conceptual gaps
- Effective study strategies specific to each CA paper
- India's CA examination system

Provide specific, actionable, deeply personalized diagnostic reports. Be honest about failures but encouraging. Format your response using markdown with clear sections.`;

  const userPrompt = `Please provide a comprehensive CA exam diagnostic report for:

**Student:** ${name}
**CA Level:** ${examLevel}
**Attempt Number:** ${attemptNumber}
**Weekly Study Hours:** ${studyHours ?? "Not specified"}

**Subject Performance:**
${subjectsSummary}

**Self-identified Weak Areas:** ${weakAreas.length > 0 ? weakAreas.join(", ") : "None specified"}

Generate a detailed diagnostic report with these sections:

## 1. Performance Overview
Brief summary of overall performance, pass/fail status, and key observations.

## 2. Failure Pattern Analysis
What specific patterns explain why they're failing. Be specific about which subjects and why.

## 3. Subject-by-Subject Breakdown
For each subject: what the score reveals about their conceptual understanding, common mistakes ICAI examiners see, and what's likely being tested that they're missing.

## 4. Root Cause Diagnosis
The 3-5 core reasons they're not passing — concept gaps, exam technique, time management, revision strategy, etc.

## 5. Your Precision Study Plan
A specific, week-by-week or phase-based action plan covering:
- Priority subjects to focus on (most marks to gain)
- Specific ICAI materials and modules to study
- Practice test strategy (RTPs, MTPs, past papers)
- What NOT to waste time on

## 6. Examiner's Secret
2-3 insider tips about how ICAI sets papers for ${examLevel} that most students don't realize.

## 7. Motivational Message
A brief, genuine, personalized message — acknowledge their effort and give them concrete hope.

Be specific, data-driven, and actionable. Reference actual ICAI paper patterns and marking schemes.`;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  let fullReport = "";

  const stream = await openai.chat.completions.create({
    model: "gpt-5.2",
    max_completion_tokens: 8192,
    messages: [
      { role: "system", content: systemPrompt },
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
