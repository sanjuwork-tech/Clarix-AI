import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Link } from "wouter";

const CHARCOAL  = "#1C1917";
const PARCHMENT = "#FAF8F4";
const SURFACE   = "#F5F2EC";
const WHITE     = "#FFFFFF";
const AMBER     = "#D4930A";
const AMBER_LT  = "#F2B93B";
const AMBER_DEEP = "#7C3F00";
const MUTED     = "#78716C";
const BORDER    = "#E7E5E0";

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
          return (
            <h3 key={i} style={{
              fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 600,
              color: CHARCOAL, margin: "32px 0 12px", paddingBottom: 10,
              borderBottom: `2px solid ${BORDER}`, letterSpacing: "-0.01em",
            }}>{line.replace("## ", "")}</h3>
          );
        if (line.startsWith("### "))
          return (
            <h4 key={i} style={{
              fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 600,
              color: CHARCOAL, margin: "20px 0 6px",
            }}>{line.replace("### ", "")}</h4>
          );
        if (line.startsWith("- ") || line.startsWith("* "))
          return (
            <div key={i} style={{ display: "flex", gap: 10, margin: "6px 0" }}>
              <span style={{ color: AMBER, marginTop: 2, flexShrink: 0 }}>—</span>
              <span style={{ fontSize: 14, color: MUTED, lineHeight: 1.7 }}
                dangerouslySetInnerHTML={{ __html: line.replace(/^[-*] /, "").replace(/\*\*(.*?)\*\*/g, `<strong style="color:${CHARCOAL}">$1</strong>`) }} />
            </div>
          );
        if (line.trim() === "") return <div key={i} style={{ height: 10 }} />;
        return (
          <p key={i} style={{ fontSize: 14, color: MUTED, lineHeight: 1.75 }}
            dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, `<strong style="color:${CHARCOAL}">$1</strong>`) }} />
        );
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

  const inputStyle = {
    width: "100%", background: WHITE, border: `1px solid ${BORDER}`, color: CHARCOAL,
    padding: "12px 16px", fontSize: 14, fontFamily: "'Space Grotesk', sans-serif",
    outline: "none", borderRadius: 8, transition: "border-color .2s",
  };

  const labelStyle = {
    display: "block" as const, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11,
    color: MUTED, letterSpacing: ".08em", textTransform: "uppercase" as const, marginBottom: 6,
  };

  return (
    <div style={{ background: PARCHMENT, minHeight: "100vh", color: CHARCOAL, fontFamily: "'Space Grotesk', sans-serif" }}>

      {/* Nav */}
      <nav style={{
        height: 64, display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 40px", background: "rgba(250,248,244,0.92)", backdropFilter: "blur(8px)",
        borderBottom: `1px solid ${BORDER}`, position: "sticky", top: 0, zIndex: 100,
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none" }}>
          <svg width="26" height="26" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <path d="M 26 16 A 10 10 0 1 1 21 7.34" stroke={AMBER} strokeWidth="3" strokeLinecap="round" />
            <circle className="logo-dot" cx="24.66" cy="11" r="3" fill={AMBER} />
          </svg>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 600, letterSpacing: "-0.3px", color: CHARCOAL }}>
            Clarix<span style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 400, color: AMBER, letterSpacing: "2.5px", fontSize: 13 }}>.AI</span>
          </span>
        </Link>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: AMBER_DEEP,
          background: "rgba(212,147,10,0.08)", border: "1px solid rgba(212,147,10,0.25)",
          padding: "4px 10px", borderRadius: 4, letterSpacing: ".08em", textTransform: "uppercase",
        }}>
          CA Diagnostic Tool
        </div>
      </nav>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "64px 40px" }}>

        {/* STEP 1 */}
        {step === 1 && (
          <div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: AMBER, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ display: "inline-block", width: 24, height: 1, background: AMBER }} />
              Step 01 of 02
            </div>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(28px,5vw,44px)", fontWeight: 600, lineHeight: 1.1, letterSpacing: "-0.02em", color: CHARCOAL, marginBottom: 12 }}>
              Tell us about your attempt.
            </h1>
            <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.7, marginBottom: 40, maxWidth: 480 }}>
              Clarix.ai needs your exam data to diagnose your failure pattern. This takes about 10 minutes.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 28px" }}>
              <div>
                <label style={labelStyle}>Full Name</label>
                <input {...register("name", { required: true })} placeholder="Bhargavi Sharma" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input {...register("email", { required: true })} type="email" placeholder="you@example.com" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Attempt Number</label>
                <select {...register("attemptNumber")} style={{ ...inputStyle, appearance: "none" as const }}>
                  {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n === 1 ? "1st (First)" : n === 2 ? "2nd" : n === 3 ? "3rd" : `${n}th`} attempt</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Daily Study Hours</label>
                <select {...register("studyHours")} style={{ ...inputStyle, appearance: "none" as const }}>
                  <option value="">Select...</option>
                  <option value="less than 4 hours">Less than 4 hrs</option>
                  <option value="4-6 hours">4–6 hrs</option>
                  <option value="6-8 hours">6–8 hrs</option>
                  <option value="8-10 hours">8–10 hrs</option>
                  <option value="10+ hours">10+ hrs</option>
                </select>
              </div>
            </div>

            <div style={{ marginTop: 32 }}>
              <label style={{ ...labelStyle, marginBottom: 12 }}>Select Your CA Level</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {Object.keys(CA_LEVELS).map(level => (
                  <button key={level} type="button" onClick={() => handleLevelChange(level)}
                    style={{
                      padding: "14px 18px", textAlign: "left", fontSize: 14, fontWeight: 400,
                      background: examLevel === level ? "rgba(212,147,10,0.08)" : WHITE,
                      border: `1px solid ${examLevel === level ? "rgba(212,147,10,0.4)" : BORDER}`,
                      color: examLevel === level ? AMBER_DEEP : MUTED,
                      borderRadius: 8, cursor: "pointer", transition: "all .15s",
                      fontFamily: "'Space Grotesk', sans-serif",
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
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: AMBER, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ display: "inline-block", width: 24, height: 1, background: AMBER }} />
              Step 02 of 02
            </div>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(24px,4vw,38px)", fontWeight: 600, lineHeight: 1.1, letterSpacing: "-0.02em", color: CHARCOAL, marginBottom: 6 }}>
              Enter your subject marks.
            </h1>
            <p style={{ fontSize: 14, color: MUTED, marginBottom: 32 }}>{examLevel} — leave score blank if not attempted</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 0, background: WHITE, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: "hidden" }}>
              {fields.map((field, i) => {
                const scoreVal = watch(`subjects.${i}.score`);
                const scoreNum = scoreVal ? parseInt(scoreVal) : null;
                const pass = scoreNum !== null && scoreNum >= 40;
                return (
                  <div key={field.id} style={{
                    display: "grid", gridTemplateColumns: "1fr auto auto", alignItems: "center",
                    gap: 12, padding: "16px 20px",
                    borderBottom: i < fields.length - 1 ? `1px solid ${BORDER}` : undefined,
                  }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: CHARCOAL }}>{field.subject}</div>
                      <div style={{ fontSize: 11, color: MUTED, fontFamily: "'IBM Plex Mono', monospace", marginTop: 2, letterSpacing: ".04em" }}>Max 100</div>
                    </div>
                    <input
                      {...register(`subjects.${i}.score`)}
                      type="number" placeholder="Score" min="0" max="100"
                      style={{ width: 80, background: SURFACE, border: `1px solid ${BORDER}`, color: CHARCOAL, padding: "10px 12px", fontSize: 13, textAlign: "center", outline: "none", borderRadius: 6, fontFamily: "'IBM Plex Mono', monospace" }}
                    />
                    {scoreNum !== null ? (
                      <div style={{
                        fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: ".08em",
                        textTransform: "uppercase", padding: "4px 9px", borderRadius: 4,
                        color: pass ? "#1A4731" : "#7C3F00",
                        background: pass ? "rgba(45,106,79,0.1)" : "rgba(146,64,14,0.1)",
                        border: `1px solid ${pass ? "rgba(45,106,79,0.25)" : "rgba(146,64,14,0.25)"}`,
                      }}>
                        {pass ? "Pass" : "Fail"}
                      </div>
                    ) : <div style={{ width: 52 }} />}
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: 32 }}>
              <label style={{ ...labelStyle, marginBottom: 12 }}>Your Weak Areas (select all that apply)</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {WEAK_AREAS.map(area => {
                  const sel = weakAreas.includes(area);
                  return (
                    <button key={area} type="button" onClick={() => toggleWeakArea(area)}
                      style={{
                        padding: "7px 13px", fontSize: 12,
                        fontFamily: "'IBM Plex Mono', monospace", letterSpacing: ".04em",
                        borderRadius: 6, cursor: "pointer",
                        border: `1px solid ${sel ? "rgba(212,147,10,0.4)" : BORDER}`,
                        background: sel ? "rgba(212,147,10,0.08)" : WHITE,
                        color: sel ? AMBER_DEEP : MUTED,
                        transition: "all .15s",
                      }}>
                      {sel ? "✓ " : ""}{area}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 40 }}>
              <button type="button" onClick={() => setStep(1)} className="btn-secondary">
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
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: AMBER, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 24 }}>Analysing your failure pattern</div>
                <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 32, fontWeight: 600, letterSpacing: "-0.02em", color: CHARCOAL, marginBottom: 16 }}>AI is building your report...</h2>
                <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.7, maxWidth: 380, margin: "0 auto" }}>
                  Cross-referencing your scores against ICAI's past papers, RTPs, and marking schemes.
                </p>
                <div style={{ marginTop: 32, display: "flex", justifyContent: "center", gap: 7 }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{ width: 7, height: 7, background: AMBER, borderRadius: "50%", animation: `dotbounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div style={{ background: "rgba(146,64,14,0.06)", border: "1px solid rgba(146,64,14,0.2)", padding: 32, borderRadius: 12, textAlign: "center" }}>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 600, color: CHARCOAL, marginBottom: 8 }}>Analysis failed</div>
                <p style={{ fontSize: 14, color: MUTED, marginBottom: 24 }}>{error}</p>
                <button onClick={() => setStep(1)} className="btn-primary">Try Again</button>
              </div>
            )}

            {report && (
              <div>
                <div style={{ marginBottom: 32, paddingBottom: 24, borderBottom: `1px solid ${BORDER}` }}>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: AMBER, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 12 }}>
                    Your Diagnostic Report {diagnosticId ? `· #${diagnosticId}` : ""}
                  </div>
                  <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 32, fontWeight: 600, letterSpacing: "-0.02em", color: CHARCOAL, marginBottom: 6 }}>
                    {watch("examLevel")} · Attempt {watch("attemptNumber")}
                  </h2>
                  <p style={{ fontSize: 14, color: MUTED }}>Grounded in ICAI's own material. Built for {watch("name")}.</p>
                </div>

                <MarkdownReport text={report} />
                {isAnalyzing && (
                  <span style={{ display: "inline-block", width: 2, height: 18, background: AMBER, marginLeft: 4, animation: "blink 0.8s ease-in-out infinite", verticalAlign: "middle" }} />
                )}

                {!isAnalyzing && (
                  <div style={{ marginTop: 48, paddingTop: 32, borderTop: `1px solid ${BORDER}`, display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <button
                      onClick={() => { setStep(1); setReport(""); setDiagnosticId(null); }}
                      className="btn-secondary"
                    >
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
        @keyframes clarixPulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.25);opacity:0.8} }
        .logo-dot { animation: clarixPulse 2.8s ease-in-out infinite; transform-origin: center; }
        @keyframes dotbounce { 0%,100%{transform:translateY(0);opacity:.4} 50%{transform:translateY(-7px);opacity:1} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        input::placeholder { color: #9CA3AF; }
        input:focus, select:focus { border-color: #D4930A !important; }
        select option { background: #FFFFFF; color: #1C1917; }
        @media (max-width: 640px) {
          nav { padding: 0 20px !important; }
          div[style*="max-width: 720px"] { padding-left: 20px !important; padding-right: 20px !important; }
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
