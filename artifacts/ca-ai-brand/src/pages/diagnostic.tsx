import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Link } from "wouter";

const INK   = "#0D0C0A";
const INK2  = "#1A1915";
const INK3  = "#252420";
const AMBER = "#D4930A";
const AMBER_LT = "#F2B93B";
const OFFWHITE = "#F0EDE6";
const MUTED = "#8A877E";
const BORDER = "rgba(240,237,230,0.1)";

const CA_LEVELS: Record<string, string[]> = {
  "CA Foundation": [
    "Principles and Practice of Accounting",
    "Business Laws & Business Correspondence",
    "Business Mathematics & Logical Reasoning",
    "Business Economics & Business & Commercial Knowledge",
  ],
  "CA Intermediate — Group 1": [
    "Accounting",
    "Corporate & Other Laws",
    "Cost and Management Accounting",
    "Taxation",
  ],
  "CA Intermediate — Group 2": [
    "Advanced Accounting",
    "Auditing and Assurance",
    "Enterprise Information Systems & Strategic Management",
    "Financial Management & Economics for Finance",
  ],
  "CA Final — Group 1": [
    "Financial Reporting (FR)",
    "Strategic Financial Management (SFM)",
    "Advanced Auditing & Professional Ethics",
    "Corporate & Economic Laws",
  ],
  "CA Final — Group 2": [
    "Strategic Cost Management & Performance Evaluation",
    "Elective Paper",
    "Direct Tax Laws & International Taxation",
    "Indirect Tax Laws",
  ],
};

const WEAK_AREAS = [
  "Theory questions", "Practical sums", "Time management",
  "MCQ sections", "Case study questions", "Remembering standards",
  "Recent amendments", "Answer format/writing", "Revision volume", "Conceptual clarity",
];

type Subject = { subject: string; score: string; maxScore: string };
type FormData = {
  name: string; email: string; examLevel: string;
  attemptNumber: string; studyHours: string;
  subjects: Subject[]; weakAreas: string[];
};

function MarkdownReport({ text }: { text: string }) {
  return (
    <div>
      {text.split("\n").map((line, i) => {
        if (line.startsWith("## "))
          return <h3 key={i} style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 600, color: OFFWHITE, margin: "28px 0 10px", paddingBottom: 8, borderBottom: `1px solid ${BORDER}` }}>{line.replace("## ", "")}</h3>;
        if (line.startsWith("### "))
          return <h4 key={i} style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 600, color: OFFWHITE, margin: "20px 0 6px" }}>{line.replace("### ", "")}</h4>;
        if (line.startsWith("- ") || line.startsWith("* "))
          return (
            <div key={i} style={{ display: "flex", gap: 10, margin: "4px 0" }}>
              <span style={{ color: AMBER, marginTop: 2, flexShrink: 0 }}>—</span>
              <span style={{ fontSize: 13, color: MUTED, lineHeight: 1.65 }} dangerouslySetInnerHTML={{ __html: line.replace(/^[-*] /, "").replace(/\*\*(.*?)\*\*/g, `<strong style="color:${OFFWHITE}">$1</strong>`) }} />
            </div>
          );
        if (line.trim() === "") return <div key={i} style={{ height: 8 }} />;
        return <p key={i} style={{ fontSize: 13, color: MUTED, lineHeight: 1.75 }} dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, `<strong style="color:${OFFWHITE}">$1</strong>`) }} />;
      })}
    </div>
  );
}

export default function DiagnosticPage() {
  const [step, setStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState("");
  const [diagnosticId, setDiagnosticId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const { register, handleSubmit, watch, setValue, control } = useForm<FormData>({
    defaultValues: { name: "", email: "", examLevel: "", attemptNumber: "1", studyHours: "", subjects: [], weakAreas: [] },
  });
  const { fields, replace } = useFieldArray({ control, name: "subjects" });

  const examLevel = watch("examLevel");
  const weakAreas = watch("weakAreas") || [];

  const handleLevelChange = (level: string) => {
    setValue("examLevel", level);
    replace((CA_LEVELS[level] || []).map(s => ({ subject: s, score: "", maxScore: "100" })));
  };

  const toggleWeakArea = (area: string) => {
    setValue("weakAreas", weakAreas.includes(area) ? weakAreas.filter(a => a !== area) : [...weakAreas, area]);
  };

  const onSubmit = async (data: FormData) => {
    setIsAnalyzing(true); setReport(""); setError(""); setStep(3);
    try {
      const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
      const res = await fetch(`${BASE}/api/diagnostic/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name, email: data.email, examLevel: data.examLevel,
          attemptNumber: parseInt(data.attemptNumber) || 1,
          studyHours: data.studyHours || null,
          subjects: data.subjects.map(s => ({ subject: s.subject, score: s.score ? parseInt(s.score) : null, maxScore: parseInt(s.maxScore) || 100 })),
          weakAreas: data.weakAreas,
        }),
      });
      if (!res.ok) throw new Error("Analysis failed. Please try again.");
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n"); buf = lines.pop() || "";
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const parsed = JSON.parse(line.slice(6));
              if (parsed.content) setReport(p => p + parsed.content);
              if (parsed.done) { setDiagnosticId(parsed.id); setIsAnalyzing(false); }
            } catch { /* ignore */ }
          }
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsAnalyzing(false);
    }
  };

  return (
    <div style={{ background: INK, minHeight: "100vh", color: OFFWHITE, fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>
      {/* Nav */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 40px", borderBottom: `1px solid ${BORDER}` }}>
        <Link href="/" style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 15, fontWeight: 500, color: OFFWHITE, display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <div style={{ width: 8, height: 8, background: AMBER, borderRadius: "50%", animation: "logopulse 2.4s ease-in-out infinite" }} />
          NirnayAI
        </Link>
        <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: AMBER, background: "rgba(212,147,10,0.12)", border: "1px solid rgba(212,147,10,0.3)", padding: "4px 10px", borderRadius: 2, letterSpacing: ".08em", textTransform: "uppercase" }}>
          CA Diagnostic Tool
        </div>
      </nav>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "64px 40px" }}>

        {/* STEP 1 */}
        {step === 1 && (
          <div>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: AMBER, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ display: "inline-block", width: 24, height: 1, background: AMBER }} />
              Step 01 of 02
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(32px,5vw,52px)", fontWeight: 600, lineHeight: 1.1, color: OFFWHITE, marginBottom: 12 }}>
              Tell us about your attempt.
            </h1>
            <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.65, marginBottom: 40, maxWidth: 480 }}>
              NirnayAI needs your exam data to diagnose your failure pattern. This takes about 10 minutes.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px 32px" }}>
              {/* Name */}
              <div>
                <label style={{ display: "block", fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: MUTED, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 8 }}>Full Name</label>
                <input {...register("name", { required: true })} placeholder="Bhargavi Sharma"
                  style={{ width: "100%", background: INK2, border: `1px solid ${BORDER}`, color: OFFWHITE, padding: "12px 16px", fontSize: 14, fontFamily: "'DM Sans',sans-serif", outline: "none", borderRadius: 2 }} />
              </div>
              {/* Email */}
              <div>
                <label style={{ display: "block", fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: MUTED, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 8 }}>Email</label>
                <input {...register("email", { required: true })} type="email" placeholder="you@example.com"
                  style={{ width: "100%", background: INK2, border: `1px solid ${BORDER}`, color: OFFWHITE, padding: "12px 16px", fontSize: 14, fontFamily: "'DM Sans',sans-serif", outline: "none", borderRadius: 2 }} />
              </div>
              {/* Attempt */}
              <div>
                <label style={{ display: "block", fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: MUTED, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 8 }}>Attempt Number</label>
                <select {...register("attemptNumber")} style={{ width: "100%", background: INK2, border: `1px solid ${BORDER}`, color: OFFWHITE, padding: "12px 16px", fontSize: 14, fontFamily: "'DM Sans',sans-serif", outline: "none", borderRadius: 2 }}>
                  {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n === 1 ? "1st (First)" : n === 2 ? "2nd" : n === 3 ? "3rd" : `${n}th`} attempt</option>)}
                </select>
              </div>
              {/* Study hours */}
              <div>
                <label style={{ display: "block", fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: MUTED, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 8 }}>Daily Study Hours</label>
                <select {...register("studyHours")} style={{ width: "100%", background: INK2, border: `1px solid ${BORDER}`, color: OFFWHITE, padding: "12px 16px", fontSize: 14, fontFamily: "'DM Sans',sans-serif", outline: "none", borderRadius: 2 }}>
                  <option value="">Select...</option>
                  <option value="less than 4 hours">Less than 4 hrs</option>
                  <option value="4-6 hours">4–6 hrs</option>
                  <option value="6-8 hours">6–8 hrs</option>
                  <option value="8-10 hours">8–10 hrs</option>
                  <option value="10+ hours">10+ hrs</option>
                </select>
              </div>
            </div>

            {/* CA Level */}
            <div style={{ marginTop: 32 }}>
              <label style={{ display: "block", fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: MUTED, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 16 }}>Select Your CA Level</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                {Object.keys(CA_LEVELS).map(level => (
                  <button key={level} type="button" onClick={() => handleLevelChange(level)}
                    style={{
                      padding: "14px 20px", textAlign: "left", fontSize: 13, fontWeight: 400,
                      background: examLevel === level ? "rgba(212,147,10,0.12)" : INK2,
                      border: `1px solid ${examLevel === level ? "rgba(212,147,10,0.4)" : BORDER}`,
                      color: examLevel === level ? AMBER_LT : MUTED,
                      borderRadius: 2, cursor: "pointer", transition: "all .15s", fontFamily: "'DM Sans',sans-serif",
                    }}>
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              disabled={!examLevel || !watch("name") || !watch("email")}
              onClick={() => setStep(2)}
              className="btn-primary"
              style={{ marginTop: 40, padding: "14px 32px", opacity: (!examLevel || !watch("name") || !watch("email")) ? 0.4 : 1, cursor: (!examLevel || !watch("name") || !watch("email")) ? "not-allowed" : "pointer" }}
            >
              Enter Subject Marks →
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: AMBER, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ display: "inline-block", width: 24, height: 1, background: AMBER }} />
              Step 02 of 02
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(28px,4vw,44px)", fontWeight: 600, lineHeight: 1.1, color: OFFWHITE, marginBottom: 6 }}>
              Enter your subject marks.
            </h1>
            <p style={{ fontSize: 13, color: MUTED, marginBottom: 32 }}>{examLevel} — leave score blank if not attempted</p>

            {/* Subjects */}
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {fields.map((field, i) => {
                const scoreVal = watch(`subjects.${i}.score`);
                const scoreNum = scoreVal ? parseInt(scoreVal) : null;
                const pass = scoreNum !== null && scoreNum >= 40;
                return (
                  <div key={field.id} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", alignItems: "center", gap: 12, padding: "14px 0", borderBottom: `1px solid ${BORDER}`, borderTop: i === 0 ? `1px solid ${BORDER}` : undefined }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: OFFWHITE }}>{field.subject}</div>
                      <div style={{ fontSize: 11, color: MUTED, fontFamily: "'IBM Plex Mono',monospace", marginTop: 2 }}>Max 100</div>
                    </div>
                    <input
                      {...register(`subjects.${i}.score`)}
                      type="number" placeholder="Score" min="0" max="100"
                      style={{ width: 80, background: INK2, border: `1px solid ${BORDER}`, color: OFFWHITE, padding: "10px 12px", fontSize: 13, textAlign: "center", outline: "none", borderRadius: 2, fontFamily: "'IBM Plex Mono',monospace" }}
                    />
                    {scoreNum !== null && (
                      <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, letterSpacing: ".08em", textTransform: "uppercase", padding: "4px 8px", borderRadius: 2, color: pass ? "#4ade80" : "#f87171", background: pass ? "rgba(74,222,128,0.1)" : "rgba(248,113,113,0.1)", border: `1px solid ${pass ? "rgba(74,222,128,0.2)" : "rgba(248,113,113,0.2)"}` }}>
                        {pass ? "Pass" : "Fail"}
                      </div>
                    )}
                    {scoreNum === null && <div style={{ width: 52 }} />}
                  </div>
                );
              })}
            </div>

            {/* Weak areas */}
            <div style={{ marginTop: 32 }}>
              <label style={{ display: "block", fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: MUTED, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 16 }}>Your Weak Areas (select all that apply)</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {WEAK_AREAS.map(area => {
                  const sel = weakAreas.includes(area);
                  return (
                    <button key={area} type="button" onClick={() => toggleWeakArea(area)}
                      style={{ padding: "6px 12px", fontSize: 12, fontFamily: "'IBM Plex Mono',monospace", letterSpacing: ".04em", borderRadius: 2, cursor: "pointer", border: `1px solid ${sel ? "rgba(212,147,10,0.4)" : BORDER}`, background: sel ? "rgba(212,147,10,0.12)" : "transparent", color: sel ? AMBER_LT : MUTED, transition: "all .15s" }}>
                      {sel ? "✓ " : ""}{area}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: "flex", gap: 16, marginTop: 40 }}>
              <button type="button" onClick={() => setStep(1)} style={{ padding: "14px 24px", background: "transparent", border: `1px solid ${BORDER}`, color: MUTED, fontSize: 13, borderRadius: 2, cursor: "pointer", fontFamily: "'IBM Plex Mono',monospace", letterSpacing: ".04em" }}>
                ← Back
              </button>
              <button type="submit" className="btn-primary" style={{ padding: "14px 32px" }}>
                Generate My Diagnostic Report →
              </button>
            </div>
          </form>
        )}

        {/* STEP 3 — Report */}
        {step === 3 && (
          <div>
            {isAnalyzing && !report && (
              <div style={{ textAlign: "center", padding: "80px 0" }}>
                <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: AMBER, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 24 }}>Analysing your failure pattern</div>
                <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 36, fontWeight: 600, color: OFFWHITE, marginBottom: 16 }}>AI is building your report...</h2>
                <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.65, maxWidth: 380, margin: "0 auto" }}>
                  Cross-referencing your scores against ICAI's past papers, RTPs, and marking schemes.
                </p>
                <div style={{ marginTop: 32, display: "flex", justifyContent: "center", gap: 6 }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{ width: 6, height: 6, background: AMBER, borderRadius: "50%", animation: `dotbounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", padding: 32, borderRadius: 2, textAlign: "center" }}>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, color: OFFWHITE, marginBottom: 8 }}>Analysis failed</div>
                <p style={{ fontSize: 13, color: MUTED, marginBottom: 24 }}>{error}</p>
                <button onClick={() => setStep(1)} className="btn-primary">Try Again</button>
              </div>
            )}

            {report && (
              <div>
                {/* Report header */}
                <div style={{ marginBottom: 32, paddingBottom: 24, borderBottom: `1px solid ${BORDER}` }}>
                  <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: AMBER, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 12 }}>
                    Your Diagnostic Report {diagnosticId ? `· #${diagnosticId}` : ""}
                  </div>
                  <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 36, fontWeight: 600, color: OFFWHITE, marginBottom: 6 }}>
                    {watch("examLevel")} · Attempt {watch("attemptNumber")}
                  </h2>
                  <p style={{ fontSize: 13, color: MUTED }}>Grounded in ICAI's own material. Built for {watch("name")}.</p>
                </div>

                {/* Report body */}
                <MarkdownReport text={report} />
                {isAnalyzing && <span style={{ display: "inline-block", width: 2, height: 18, background: AMBER, marginLeft: 4, animation: "blink 0.8s ease-in-out infinite", verticalAlign: "middle" }} />}

                {!isAnalyzing && (
                  <div style={{ marginTop: 48, paddingTop: 32, borderTop: `1px solid ${BORDER}`, display: "flex", gap: 16, flexWrap: "wrap" }}>
                    <button onClick={() => { setStep(1); setReport(""); setDiagnosticId(null); }} style={{ padding: "14px 24px", background: "transparent", border: `1px solid ${BORDER}`, color: MUTED, fontSize: 12, borderRadius: 2, cursor: "pointer", fontFamily: "'IBM Plex Mono',monospace", letterSpacing: ".04em" }}>
                      New Diagnostic
                    </button>
                    <button onClick={() => window.print()} className="btn-primary" style={{ padding: "14px 28px" }}>
                      Save as PDF →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes logopulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.8)} }
        @keyframes dotbounce { 0%,100%{transform:translateY(0);opacity:.5} 50%{transform:translateY(-6px);opacity:1} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        input::placeholder { color: #555; }
        select option { background: #1A1915; color: #F0EDE6; }
        @media (max-width: 640px) {
          nav, .diag-inner { padding-left: 20px !important; padding-right: 20px !important; }
        }
      `}</style>
    </div>
  );
}
