import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "wouter";
import emailjs from "@emailjs/browser";

/* ── Design tokens ── */
const C = {
  charcoal:  "#1C1917",
  parchment: "#FAF8F4",
  surface:   "#F5F2EC",
  white:     "#FFFFFF",
  amber:     "#D4930A",
  amberLt:   "#F2B93B",
  amberDeep: "#7C3F00",
  muted:     "#78716C",
  border:    "#E7E5E0",
  error:     "#92400E",
  pass:      "#1A4731",
  passBg:    "rgba(45,106,79,0.1)",
  passBorder:"rgba(45,106,79,0.25)",
};

/* ── CA Final paper lists — both schemes ── */
const PAPERS_NEW: Record<string, string[]> = {
  "Group 1": [
    "Financial Reporting (FR)",
    "Advanced Financial Management (AFM)",
    "Advanced Auditing, Assurance & Professional Ethics (AAP)",
  ],
  "Group 2": [
    "Direct Tax Laws & International Taxation (DT)",
    "Indirect Tax Laws (IDT)",
    "Integrated Business Solutions (IBS)",
  ],
};

const PAPERS_OLD: Record<string, string[]> = {
  "Group 1": [
    "Financial Reporting (FR)",
    "Strategic Financial Management (SFM)",
    "Advanced Auditing, Assurance & Professional Ethics (AAP)",
    "Corporate & Economic Laws (CL)",
  ],
  "Group 2": [
    "Strategic Cost Management & Performance Evaluation (SCMPE)",
    "Elective Paper",
    "Direct Tax Laws & International Taxation (DT)",
    "Indirect Tax Laws (IDT)",
  ],
};

function getPapers(scheme: string, group: string): string[] {
  const map = scheme === "old" ? PAPERS_OLD : PAPERS_NEW;
  if (group === "Both") return [...(map["Group 1"] || []), ...(map["Group 2"] || [])];
  return map[group] || [];
}

/* ── Form data type ── */
type ScoreEntry = { subject: string; score: string };
type ConfidenceEntry = { subject: string; rating: "Strong" | "Shaky" | "Weak" | "" };
type FormData = {
  scheme: "new" | "old" | "";
  name: string; email: string;
  group: "Group 1" | "Group 2" | "Both" | "";
  isRepeat: "yes" | "no" | "";
  attemptCount: string;
  targetSession: string;
  studyHours: string;
  scores: ScoreEntry[];
  exemptions: string[];
  attemptedAll: "yes" | "some" | "no" | "";
  confidenceRatings: ConfidenceEntry[];
  weakestChapters: string;
  ibsMockAttempted: string;
  struggleType: string;
  timeManagement: string;
  studyMethod: string;
  revisionMaterial: string[];
  mainReason: string;
};

/* ── Markdown helpers ── */
function isTblRow(line: string) { return line.trim().startsWith("|"); }
function isTblSep(line: string) { return /^\|[\s\-:|]+\|/.test(line.trim()); }
function parseCells(line: string) {
  return line.trim().replace(/^\||\|$/g, "").split("|").map(c => c.trim());
}
function inlineHtml(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, `<strong style="color:#1C1917">$1</strong>`)
    .replace(/\*(.*?)\*/g, `<em>$1</em>`)
    .replace(/`(.*?)`/g, `<code style="font-family:'IBM Plex Mono',monospace;font-size:12px;background:#F5F2EC;padding:1px 5px;border-radius:3px">$1</code>`);
}

type Block =
  | { kind: "h2"; text: string }
  | { kind: "h3"; text: string }
  | { kind: "li"; text: string }
  | { kind: "hr" }
  | { kind: "blank" }
  | { kind: "p"; text: string }
  | { kind: "table"; headers: string[]; rows: string[][] };

function parseBlocks(text: string): Block[] {
  const lines = text.split("\n");
  const blocks: Block[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (isTblRow(line)) {
      const tableLines: string[] = [];
      while (i < lines.length && isTblRow(lines[i])) {
        tableLines.push(lines[i]);
        i++;
      }
      const nonSep = tableLines.filter(l => !isTblSep(l));
      if (nonSep.length >= 1) {
        const headers = parseCells(nonSep[0]);
        const rows = nonSep.slice(1).map(parseCells);
        blocks.push({ kind: "table", headers, rows });
      }
      continue;
    }
    if (line.startsWith("## "))       { blocks.push({ kind: "h2", text: line.replace(/^## /, "") }); }
    else if (line.startsWith("### ")) { blocks.push({ kind: "h3", text: line.replace(/^### /, "") }); }
    else if (/^[-*] /.test(line))     { blocks.push({ kind: "li", text: line.replace(/^[-*] /, "") }); }
    else if (/^---+$/.test(line.trim())) { blocks.push({ kind: "hr" }); }
    else if (line.trim() === "")      { blocks.push({ kind: "blank" }); }
    else                              { blocks.push({ kind: "p", text: line }); }
    i++;
  }
  return blocks;
}

/* ── Markdown renderer ── */
function MarkdownReport({ text }: { text: string }) {
  const blocks = parseBlocks(text);
  return (
    <div>
      {blocks.map((block, i) => {
        if (block.kind === "h2")
          return (
            <h3 key={i} style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 600, color: C.charcoal, margin: "36px 0 12px", paddingBottom: 10, borderBottom: `2px solid ${C.border}`, letterSpacing: "-0.01em" }}>
              {block.text}
            </h3>
          );
        if (block.kind === "h3")
          return <h4 key={i} style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 15, fontWeight: 600, color: C.charcoal, margin: "18px 0 5px" }}>{block.text}</h4>;
        if (block.kind === "li")
          return (
            <div key={i} style={{ display: "flex", gap: 10, margin: "5px 0" }}>
              <span style={{ color: C.amber, marginTop: 2, flexShrink: 0 }}>—</span>
              <span style={{ fontSize: 14, color: C.muted, lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: inlineHtml(block.text) }} />
            </div>
          );
        if (block.kind === "hr")
          return <div key={i} style={{ height: 1, background: C.border, margin: "20px 0" }} />;
        if (block.kind === "blank")
          return <div key={i} style={{ height: 8 }} />;
        if (block.kind === "table") {
          const cols = block.headers.length;
          return (
            <div key={i} style={{ overflowX: "auto", margin: "20px 0", borderRadius: 10, border: `1px solid ${C.border}` }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, fontFamily: "'Space Grotesk',sans-serif" }}>
                <thead>
                  <tr style={{ background: C.surface }}>
                    {block.headers.map((h, j) => (
                      <th key={j} style={{
                        padding: "11px 16px", textAlign: "left",
                        fontFamily: "'IBM Plex Mono',monospace", fontSize: 10,
                        color: C.muted, letterSpacing: ".08em", textTransform: "uppercase",
                        fontWeight: 500, borderBottom: `2px solid ${C.border}`,
                        whiteSpace: j === 0 ? "nowrap" : undefined,
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, ri) => {
                    const paddedRow = [...row];
                    while (paddedRow.length < cols) paddedRow.push("");
                    return (
                      <tr key={ri} style={{ borderBottom: ri < block.rows.length - 1 ? `1px solid ${C.border}` : undefined, background: ri % 2 === 1 ? "rgba(245,242,236,0.5)" : C.white }}>
                        {paddedRow.map((cell, ci) => (
                          <td key={ci} style={{
                            padding: "12px 16px", verticalAlign: "top",
                            color: ci === 0 ? C.charcoal : C.muted,
                            fontWeight: ci === 0 ? 500 : 400,
                            lineHeight: 1.65, fontSize: 13,
                          }} dangerouslySetInnerHTML={{ __html: inlineHtml(cell) }} />
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        }
        return (
          <p key={i} style={{ fontSize: 14, color: C.muted, lineHeight: 1.75 }}
            dangerouslySetInnerHTML={{ __html: inlineHtml(block.text) }} />
        );
      })}
    </div>
  );
}

/* ── Shared input styles ── */
const inputSx: React.CSSProperties = {
  width: "100%", background: C.white, border: `1px solid ${C.border}`,
  color: C.charcoal, padding: "11px 14px", fontSize: 14,
  fontFamily: "'Space Grotesk',sans-serif", outline: "none",
  borderRadius: 8, transition: "border-color .2s",
};
const labelSx: React.CSSProperties = {
  display: "block", fontFamily: "'IBM Plex Mono',monospace", fontSize: 10,
  color: C.muted, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 6,
};
const radioRowSx: React.CSSProperties = {
  display: "flex", gap: 8, flexWrap: "wrap",
};

function RadioGroup({
  options, value, onChange, small,
}: { options: string[]; value: string; onChange: (v: string) => void; small?: boolean }) {
  return (
    <div style={radioRowSx}>
      {options.map(o => (
        <button key={o} type="button" onClick={() => onChange(o)}
          style={{
            padding: small ? "6px 12px" : "10px 18px",
            fontSize: small ? 12 : 13,
            fontFamily: "'Space Grotesk',sans-serif",
            borderRadius: 8, cursor: "pointer",
            border: `1px solid ${value === o ? "rgba(212,147,10,0.5)" : C.border}`,
            background: value === o ? "rgba(212,147,10,0.08)" : C.white,
            color: value === o ? C.amberDeep : C.muted,
            fontWeight: value === o ? 500 : 400,
            transition: "all .15s",
          }}>
          {o}
        </button>
      ))}
    </div>
  );
}

function MultiCheck({
  options, value, onChange,
}: { options: string[]; value: string[]; onChange: (v: string[]) => void }) {
  const toggle = (o: string) =>
    onChange(value.includes(o) ? value.filter(x => x !== o) : [...value, o]);
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {options.map(o => {
        const sel = value.includes(o);
        return (
          <button key={o} type="button" onClick={() => toggle(o)}
            style={{
              padding: "7px 13px", fontSize: 12,
              fontFamily: "'IBM Plex Mono',monospace", letterSpacing: ".03em",
              borderRadius: 6, cursor: "pointer",
              border: `1px solid ${sel ? "rgba(212,147,10,0.4)" : C.border}`,
              background: sel ? "rgba(212,147,10,0.08)" : C.white,
              color: sel ? C.amberDeep : C.muted,
              transition: "all .15s",
            }}>
            {sel ? "✓ " : ""}{o}
          </button>
        );
      })}
    </div>
  );
}

/* ── Progress bar ── */
function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div style={{ marginBottom: 40 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: C.amber, letterSpacing: ".08em", textTransform: "uppercase" }}>
          Section {current} of {total}
        </span>
        <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: C.muted }}>{pct}%</span>
      </div>
      <div style={{ height: 4, background: C.border, borderRadius: 2, overflow: "hidden" }}>
        <div style={{
          height: "100%", background: C.amber, borderRadius: 2,
          width: `${pct}%`, transition: "width 0.4s ease",
        }} />
      </div>
    </div>
  );
}

/* ── Section heading ── */
function SectionHead({
  eyebrow, title, sub, time,
}: { eyebrow: string; title: string; sub?: string; time: string }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <span style={{ display: "inline-block", width: 24, height: 1, background: C.amber }} />
        <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: C.amber, letterSpacing: ".1em", textTransform: "uppercase" }}>{eyebrow}</span>
        <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: C.muted, marginLeft: "auto" }}>≈ {time}</span>
      </div>
      <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "clamp(24px,4vw,36px)", fontWeight: 600, lineHeight: 1.1, letterSpacing: "-0.02em", color: C.charcoal, marginBottom: 10 }}>
        {title}
      </h1>
      {sub && <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7 }}>{sub}</p>}
    </div>
  );
}

/* ── Field wrapper ── */
function Field({ label, children, span2 }: { label: string; children: React.ReactNode; span2?: boolean }) {
  return (
    <div style={{ gridColumn: span2 ? "1 / -1" : undefined }}>
      <label style={labelSx}>{label}</label>
      {children}
    </div>
  );
}

export default function DiagnosticPage() {
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }); }, []);

  /* section 0 = scheme gate; 1-4 = main form sections */
  const [section, setSection] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState("");
  const [error, setError] = useState("");

  const { register, watch, setValue, handleSubmit, getValues } = useForm<FormData>({
    defaultValues: {
      scheme: "", name: "", email: "", group: "", isRepeat: "", attemptCount: "",
      targetSession: "", studyHours: "",
      scores: [], exemptions: [], attemptedAll: "",
      confidenceRatings: [], weakestChapters: "", ibsMockAttempted: "",
      struggleType: "", timeManagement: "",
      studyMethod: "", revisionMaterial: [], mainReason: "",
    },
  });

  const scheme   = watch("scheme");
  const group    = watch("group");
  const isRepeat = watch("isRepeat");
  const scores   = watch("scores");
  const exemptions = watch("exemptions");
  const revisionMaterial = watch("revisionMaterial");
  const confidenceRatings = watch("confidenceRatings");

  /* Sync papers and confidence slots when scheme or group changes */
  useEffect(() => {
    if (!group || !scheme) return;
    const papers = getPapers(scheme, group);
    setValue("scores", papers.map(p => ({ subject: p, score: "" })));
    setValue("confidenceRatings", papers.map(p => ({ subject: p, rating: "" })));
    setValue("exemptions", []);
  }, [scheme, group, setValue]);

  const totalSections = isRepeat === "yes" ? 4 : 3;
  /* Section 2 only exists for repeaters; jump S1→S3 for first-timers */
  const nextSection = () => {
    if (section === 1 && isRepeat !== "yes") setSection(3);
    else setSection(s => s + 1);
  };
  const prevSection = () => {
    if (section === 3 && isRepeat !== "yes") setSection(1);
    else setSection(s => s - 1);
  };

  /* For progress display, normalise section to 1-totalSections (section 0 not counted) */
  const progressCurrent = isRepeat !== "yes" && section >= 3 ? section - 1 : section;

  const canSection0 = !!scheme;

  const canSection1 =
    watch("name").trim() && watch("email").trim() &&
    group && isRepeat &&
    watch("targetSession") && watch("studyHours");

  const canSection2 = watch("attemptedAll");

  const canSection3 =
    confidenceRatings.every(r => r.rating) &&
    watch("struggleType") && watch("timeManagement");

  const onSubmit = async (data: FormData) => {
    setIsAnalyzing(true); setReport(""); setError("");
    const papers = getPapers(data.scheme || "new", data.group || "");
    try {
      const body = {
        name: data.name,
        email: data.email,
        examLevel: `CA Final — ${data.group} (${data.scheme === "old" ? "Old Scheme" : "New Scheme 2023"})`,
        attemptNumber: parseInt(data.attemptCount) || 1,
        scheme: data.scheme as "new" | "old",
        group: data.group,
        isRepeat: data.isRepeat === "yes",
        attemptCount: parseInt(data.attemptCount) || null,
        targetDate: data.targetSession,
        studyHours: data.studyHours,
        subjects: papers.map((p, i) => ({
          subject: p,
          score: data.scores[i]?.score ? parseInt(data.scores[i].score) : null,
          maxScore: 100,
        })),
        exemptions: data.exemptions,
        attemptedAll: data.attemptedAll,
        confidenceRatings: data.confidenceRatings.map(r => ({ subject: r.subject, rating: r.rating })),
        weakAreas: [],
        weakestChapters: data.weakestChapters,
        struggleType: data.struggleType,
        timeManagement: data.timeManagement,
        studyMethod: data.studyMethod,
        revisionMaterial: data.revisionMaterial,
        mainReason: data.mainReason,
      };

      /* Fire-and-forget: send form data to owner's email via EmailJS */
      emailjs.send("service_q56a8pl", "template_otko2xb", {
        from_name: data.name,
        from_email: data.email,
        subject: `CA Diagnostic — ${data.name} (${data.group}, ${data.scheme === "old" ? "Old" : "New"} Scheme)`,
        message: `Name: ${data.name}\nEmail: ${data.email}\nScheme: ${data.scheme}\nGroup: ${data.group}\nTarget: ${data.targetSession}\nStudy Hours: ${data.studyHours}\nAttempt: ${data.isRepeat === "yes" ? `Repeat #${data.attemptCount}` : "First"}\nStruggle: ${data.struggleType}\nTime Mgmt: ${data.timeManagement}\nStudy Method: ${data.studyMethod}\nMain Reason: ${data.mainReason}`,
      }, "fCEL09zuXQVmuX5ri").catch(() => { /* silent — email is backup only */ });

      /* Call Mercury 2 AI via serverless function */
      const res = await fetch("/api/diagnostic/analyze", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({ error: "Analysis failed" }));
        throw new Error(errBody.error || errBody.details || "Analysis failed. Please try again.");
      }
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
              if (parsed.done) { setIsAnalyzing(false); }
            } catch { /* ignore */ }
          }
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsAnalyzing(false);
    }
  };

  const papers = (scheme && group) ? getPapers(scheme, group) : [];

  return (
    <div style={{ background: C.parchment, minHeight: "100vh", color: C.charcoal, fontFamily: "'Space Grotesk',sans-serif" }}>

      {/* Nav */}
      <nav style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px", background: "rgba(250,248,244,0.92)", backdropFilter: "blur(8px)", borderBottom: `1px solid ${C.border}`, position: "sticky", top: 0, zIndex: 100 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none" }}>
          <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
            <path d="M 26 16 A 10 10 0 1 1 21 7.34" stroke={C.amber} strokeWidth="3" strokeLinecap="round"/>
            <circle className="logo-dot" cx="24.66" cy="11" r="3" fill={C.amber}/>
          </svg>
          <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 16, fontWeight: 600, letterSpacing: "-0.3px", color: C.charcoal }}>
            Clarix<span style={{ fontFamily: "'IBM Plex Mono',monospace", fontWeight: 400, color: C.amber, letterSpacing: "2.5px", fontSize: 13 }}>.AI</span>
          </span>
        </Link>
        <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: C.amberDeep, background: "rgba(212,147,10,0.08)", border: "1px solid rgba(212,147,10,0.25)", padding: "4px 10px", borderRadius: 4, letterSpacing: ".08em", textTransform: "uppercase" }}>
          CA Diagnostic Tool
        </div>
      </nav>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "56px 40px 80px" }}>

        {/* ── REPORT VIEW ─────────────────────────────────── */}
        {(isAnalyzing || report || error) && (
          <div>
            {isAnalyzing && !report && (
              <div style={{ textAlign: "center", padding: "80px 0" }}>
                <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: C.amber, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 24 }}>
                  Analysing your failure pattern
                </div>
                <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 30, fontWeight: 600, letterSpacing: "-0.02em", color: C.charcoal, marginBottom: 14 }}>
                  AI is building your report...
                </h2>
                <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, maxWidth: 380, margin: "0 auto" }}>
                  Cross-referencing your scores against ICAI's past papers, RTPs, and marking schemes.
                </p>
                <div style={{ marginTop: 32, display: "flex", justifyContent: "center", gap: 7 }}>
                  {[0,1,2].map(i => <div key={i} style={{ width: 7, height: 7, background: C.amber, borderRadius: "50%", animation: `dotbounce 1.2s ease-in-out ${i*0.2}s infinite` }} />)}
                </div>
              </div>
            )}

            {error && (
              <div style={{ background: "rgba(146,64,14,0.06)", border: `1px solid rgba(146,64,14,0.2)`, padding: 32, borderRadius: 12, textAlign: "center" }}>
                <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 22, fontWeight: 600, color: C.charcoal, marginBottom: 8 }}>Analysis failed</div>
                <p style={{ fontSize: 14, color: C.muted, marginBottom: 24 }}>{error}</p>
                <button onClick={() => { setError(""); setSection(0); }} className="btn-primary">Try Again</button>
              </div>
            )}

            {report && (
              <div>
                <div style={{ marginBottom: 32, paddingBottom: 24, borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: C.amber, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 12 }}>
                    Your Diagnostic Report
                  </div>
                  <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 30, fontWeight: 600, letterSpacing: "-0.02em", color: C.charcoal, marginBottom: 6 }}>
                    CA Final — {getValues("group")} · {getValues("isRepeat") === "yes" ? `Attempt ${getValues("attemptCount") || "?"}` : "First attempt"}
                  </h2>
                  <p style={{ fontSize: 14, color: C.muted }}>Grounded in ICAI's own material. Built for {getValues("name")}.</p>
                </div>
                <MarkdownReport text={report} />
                {isAnalyzing && <span style={{ display: "inline-block", width: 2, height: 18, background: C.amber, marginLeft: 4, animation: "blink 0.8s ease-in-out infinite", verticalAlign: "middle" }} />}
                {!isAnalyzing && (
                  <div style={{ marginTop: 48, paddingTop: 32, borderTop: `1px solid ${C.border}`, display: "flex", gap: 12 }}>
                    <button onClick={() => { setSection(0); setReport(""); }} className="btn-secondary">New Diagnostic</button>
                    <button onClick={() => window.print()} className="btn-primary">Save as PDF →</button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── FORM ────────────────────────────────────────── */}
        {!isAnalyzing && !report && !error && (
          <form onSubmit={handleSubmit(onSubmit)}>

            {/* Only show progress bar from section 1 onwards */}
            {section >= 1 && <ProgressBar current={progressCurrent} total={totalSections} />}

            {/* ── SECTION 0: Scheme Selector (gate before form) ── */}
            {section === 0 && (
              <div>
                <SectionHead
                  eyebrow="Before we begin"
                  title="Which ICAI CA Final scheme are you registered under?"
                  sub="This determines the paper structure of your entire diagnostic."
                  time="30 sec"
                />

                <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 32 }}>
                  {/* New Scheme option */}
                  <button type="button"
                    onClick={() => setValue("scheme", "new")}
                    style={{
                      textAlign: "left", padding: "18px 22px", borderRadius: 10, cursor: "pointer",
                      border: `2px solid ${scheme === "new" ? C.amber : C.border}`,
                      background: scheme === "new" ? "rgba(212,147,10,0.06)" : C.white,
                      transition: "all .15s",
                    }}>
                    <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 15, fontWeight: 600, color: C.charcoal, marginBottom: 4 }}>
                      New Scheme (2023)
                    </div>
                    <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: C.muted, lineHeight: 1.55 }}>
                      Registered after July 2023 · First exam from May 2024 onwards<br/>
                      6 papers · 600 marks · Papers: FR, AFM, AAP, DT, IDT, IBS
                    </div>
                  </button>

                  {/* Old Scheme option */}
                  <button type="button"
                    onClick={() => setValue("scheme", "old")}
                    style={{
                      textAlign: "left", padding: "18px 22px", borderRadius: 10, cursor: "pointer",
                      border: `2px solid ${scheme === "old" ? C.amber : C.border}`,
                      background: scheme === "old" ? "rgba(212,147,10,0.06)" : C.white,
                      transition: "all .15s",
                    }}>
                    <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 15, fontWeight: 600, color: C.charcoal, marginBottom: 4 }}>
                      Old Scheme
                    </div>
                    <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: C.muted, lineHeight: 1.55 }}>
                      Registered before July 2023 · Under the pre-2023 syllabus<br/>
                      8 papers · 800 marks · Papers: FR, SFM, AAP, CL, SCMPE, Elective, DT, IDT
                    </div>
                  </button>
                </div>

                {/* Helper note */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 8,
                  background: "rgba(212,147,10,0.06)", border: "1px solid rgba(212,147,10,0.18)",
                  borderRadius: 8, padding: "10px 14px", marginBottom: 32 }}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                    <circle cx="8" cy="8" r="7" stroke="#D4930A" strokeWidth="1.2"/>
                    <path d="M8 7v4M8 5.5v.5" stroke="#D4930A" strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                  <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: "#7C3F00", lineHeight: 1.55 }}>
                    Not sure? Check your ICAI registration letter or log in to the Students' Portal at icai.org.
                    If your first CA Final exam was in May 2024 or later, you are on the New Scheme.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setSection(1)}
                  disabled={!canSection0}
                  className="btn-primary"
                  style={{ opacity: canSection0 ? 1 : 0.35, cursor: canSection0 ? "pointer" : "not-allowed" }}
                >
                  Continue →
                </button>
              </div>
            )}

            {/* ── SECTION 1: Attempt Profile ── */}
            {section === 1 && (
              <div>
                <SectionHead
                  eyebrow={`Section 1 — Attempt Profile · ${scheme === "old" ? "Old Scheme" : "New Scheme 2023"}`}
                  title="Tell us about your attempt."
                  sub="We need a few baseline details before we can diagnose your specific gaps."
                  time="2 min"
                />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 24px" }} className="form-grid">

                  <Field label="Your full name" span2>
                    <input {...register("name", { required: true })} placeholder="Bhargavi" style={inputSx} />
                  </Field>

                  <Field label="Email address">
                    <input {...register("email", { required: true })} type="email" placeholder="you@example.com" style={inputSx} />
                  </Field>

                  {/* Privacy note */}
                  <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "flex-start", gap: 8,
                    background: "rgba(212,147,10,0.07)", border: "1px solid rgba(212,147,10,0.2)",
                    borderRadius: 8, padding: "10px 14px" }}>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                      <circle cx="8" cy="8" r="7" stroke="#D4930A" strokeWidth="1.2"/>
                      <path d="M8 7v4M8 5.5v.5" stroke="#D4930A" strokeWidth="1.3" strokeLinecap="round"/>
                    </svg>
                    <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: "#7C3F00", lineHeight: 1.5 }}>
                      Your data is not stored. It is automatically erased once you download your report.
                    </span>
                  </div>

                  <Field label="Daily study hours (be honest — not aspirational)">
                    <select {...register("studyHours", { required: true })} style={{ ...inputSx, appearance: "none" as const }}>
                      <option value="">Select...</option>
                      <option value="Less than 4 hours">Less than 4 hrs</option>
                      <option value="4–6 hours">4–6 hrs</option>
                      <option value="6–8 hours">6–8 hrs</option>
                      <option value="8–10 hours">8–10 hrs</option>
                      <option value="10+ hours">10+ hrs</option>
                    </select>
                  </Field>

                  {/* Q1 — Which group */}
                  <Field label="Which group are you appearing for next?" span2>
                    <RadioGroup
                      options={["Group 1", "Group 2", "Both"]}
                      value={group || ""}
                      onChange={v => setValue("group", v as FormData["group"])}
                    />
                  </Field>

                  {/* Q2 — First or repeat */}
                  <Field label="Is this your first attempt or a repeat?" span2>
                    <RadioGroup
                      options={["First attempt", "Repeat"]}
                      value={isRepeat === "yes" ? "Repeat" : isRepeat === "no" ? "First attempt" : ""}
                      onChange={v => setValue("isRepeat", v === "Repeat" ? "yes" : "no")}
                    />
                  </Field>

                  {isRepeat === "yes" && (
                    <Field label="How many attempts so far?">
                      <select {...register("attemptCount")} style={{ ...inputSx, appearance: "none" as const }}>
                        <option value="">Select...</option>
                        {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </Field>
                  )}

                  {/* Q3 — Next exam session (combined) */}
                  <Field label="Next exam session" span2>
                    <RadioGroup
                      options={["May 2026", "November 2026", "May 2027", "November 2027"]}
                      value={watch("targetSession")}
                      onChange={v => setValue("targetSession", v)}
                    />
                  </Field>

                </div>

                <div style={{ display: "flex", gap: 12, marginTop: 36 }}>
                  <button type="button" onClick={() => setSection(0)} className="btn-secondary">← Back</button>
                  <button
                    type="button"
                    onClick={nextSection}
                    disabled={!canSection1}
                    className="btn-primary"
                    style={{ opacity: canSection1 ? 1 : 0.35, cursor: canSection1 ? "pointer" : "not-allowed" }}
                  >
                    {isRepeat === "yes" ? "Enter My Scores →" : "Assess My Strengths →"}
                  </button>
                </div>
              </div>
            )}

            {/* ── SECTION 2: Last Attempt Scores (repeaters only) ── */}
            {section === 2 && (
              <div>
                <SectionHead
                  eyebrow="Section 2 — Last Attempt Scores"
                  title="Share your marks from your last attempt."
                  sub={`CA Final — ${group} · ${scheme === "old" ? "Old Scheme (8 papers)" : "New Scheme 2023 (6 papers)"}. Leave score blank if you didn't appear for a paper.`}
                  time="3 min"
                />

                {/* Q5 — Marks per paper */}
                <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", marginBottom: 16 }}>
                  {papers.map((paper, i) => {
                    const scoreVal = scores[i]?.score;
                    const scoreNum = scoreVal ? parseInt(scoreVal) : null;
                    const pass = scoreNum !== null && scoreNum >= 40;
                    const exempt = exemptions.includes(paper);
                    const isIBS = paper.includes("IBS");
                    return (
                      <div key={paper}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto", alignItems: "center", gap: 12, padding: "14px 20px", borderBottom: i < papers.length - 1 && !isIBS ? `1px solid ${C.border}` : undefined }}>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 500, color: C.charcoal }}>{paper}</div>
                            <div style={{ fontSize: 11, color: C.muted, fontFamily: "'IBM Plex Mono',monospace", marginTop: 2 }}>
                              {isIBS ? "out of 100 · Open-book · 4 hrs" : "out of 100"}
                            </div>
                          </div>
                          <input
                            value={scores[i]?.score || ""}
                            onChange={e => {
                              const s = [...(scores || [])];
                              s[i] = { subject: paper, score: e.target.value };
                              setValue("scores", s);
                            }}
                            type="number" placeholder="—" min="0" max="100" disabled={exempt}
                            style={{ width: 72, background: C.surface, border: `1px solid ${C.border}`, color: C.charcoal, padding: "9px 10px", fontSize: 13, textAlign: "center", outline: "none", borderRadius: 6, fontFamily: "'IBM Plex Mono',monospace", opacity: exempt ? 0.4 : 1 }}
                          />
                          {/* Exemption toggle */}
                          <button type="button"
                            onClick={() => setValue("exemptions", exempt ? exemptions.filter(x => x !== paper) : [...exemptions, paper])}
                            style={{ fontSize: 10, fontFamily: "'IBM Plex Mono',monospace", padding: "4px 8px", borderRadius: 4, cursor: "pointer", border: `1px solid ${exempt ? "rgba(45,106,79,0.4)" : C.border}`, background: exempt ? "rgba(45,106,79,0.08)" : "transparent", color: exempt ? C.pass : C.muted, letterSpacing: ".04em" }}>
                            {exempt ? "✓ Exempt" : "Exempt?"}
                          </button>
                          {scoreNum !== null && !exempt && (
                            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, padding: "4px 8px", borderRadius: 4, color: pass ? C.pass : C.error, background: pass ? C.passBg : "rgba(146,64,14,0.08)", border: `1px solid ${pass ? C.passBorder : "rgba(146,64,14,0.25)"}`, letterSpacing: ".06em" }}>
                              {pass ? "Pass" : "Fail"}
                            </div>
                          )}
                          {(scoreNum === null || exempt) && <div style={{ width: 52 }} />}
                        </div>
                        {/* IBS-specific helper */}
                        {isIBS && (
                          <div style={{ background: "rgba(212,147,10,0.04)", borderTop: `1px solid ${C.border}`, borderBottom: i < papers.length - 1 ? `1px solid ${C.border}` : undefined, padding: "8px 20px" }}>
                            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: C.muted }}>
                              IBS is open-book (4 hrs) — 5 case studies × 25 marks, attempt any 4. If this was your first attempt and you haven't appeared yet, leave blank.
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Passing criteria helper */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 8,
                  background: "rgba(26,71,49,0.05)", border: "1px solid rgba(26,71,49,0.18)",
                  borderRadius: 8, padding: "10px 14px", marginBottom: 24 }}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                    <circle cx="8" cy="8" r="7" stroke="#1A4731" strokeWidth="1.2"/>
                    <path d="M5 8l2 2 4-4" stroke="#1A4731" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: "#1A4731", lineHeight: 1.55 }}>
                    Passing criteria: Minimum 40 marks in each paper + minimum 50% aggregate in your group (min 150/300).
                    {scheme === "new" && " Exemption: Score 60+ in any paper = permanently exempted from that paper."}
                  </span>
                </div>

                {/* Q7 — Did you attempt all questions */}
                <Field label="Did you attempt all questions in each paper, or leave any?" span2>
                  <RadioGroup
                    options={["Yes — attempted all", "Some — left questions in some papers", "No — left questions in most papers"]}
                    value={
                      watch("attemptedAll") === "yes" ? "Yes — attempted all" :
                      watch("attemptedAll") === "some" ? "Some — left questions in some papers" :
                      watch("attemptedAll") === "no" ? "No — left questions in most papers" : ""
                    }
                    onChange={v =>
                      setValue("attemptedAll", v.startsWith("Yes") ? "yes" : v.startsWith("Some") ? "some" : "no")
                    }
                  />
                </Field>

                <div style={{ display: "flex", gap: 12, marginTop: 36 }}>
                  <button type="button" onClick={prevSection} className="btn-secondary">← Back</button>
                  <button type="button" onClick={nextSection} disabled={!canSection2} className="btn-primary"
                    style={{ opacity: canSection2 ? 1 : 0.35, cursor: canSection2 ? "pointer" : "not-allowed" }}>
                    Assess My Strengths →
                  </button>
                </div>
              </div>
            )}

            {/* ── SECTION 3: Self-Assessed Weak Areas ── */}
            {section === 3 && (
              <div>
                <SectionHead
                  eyebrow="Section 3 — Self-Assessed Weak Areas"
                  title="Be honest about where you stand."
                  sub="This is the most important section. The AI uses this to identify your exact failure pattern."
                  time="4 min"
                />

                {/* Q8 — Confidence per subject */}
                <div style={{ marginBottom: 28 }}>
                  <label style={labelSx}>For each subject — rate your confidence</label>
                  <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
                    {papers.map((paper, i) => {
                      const rating = confidenceRatings[i]?.rating || "";
                      const isIBS = paper.includes("IBS");
                      return (
                        <div key={paper}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "14px 20px", borderBottom: i < papers.length - 1 && !isIBS ? `1px solid ${C.border}` : undefined }}>
                            <div style={{ fontSize: 13, fontWeight: 500, color: C.charcoal, flex: 1 }}>{paper}</div>
                            <RadioGroup
                              options={["Strong", "Shaky", "Weak"]}
                              value={rating}
                              onChange={v => {
                                const r = [...confidenceRatings];
                                r[i] = { subject: paper, rating: v as "Strong" | "Shaky" | "Weak" };
                                setValue("confidenceRatings", r);
                              }}
                              small
                            />
                          </div>
                          {isIBS && (
                            <div style={{ background: "rgba(212,147,10,0.04)", borderTop: `1px solid ${C.border}`, borderBottom: i < papers.length - 1 ? `1px solid ${C.border}` : undefined, padding: "6px 20px" }}>
                              <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: C.muted }}>
                                IBS: Rate your confidence in applying concepts across subjects in a case-study format.
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* IBS Mock Test question — New Scheme only */}
                {scheme === "new" && (papers.some(p => p.includes("IBS"))) && (
                  <div style={{ marginBottom: 24 }}>
                    <label style={labelSx}>For IBS (Paper 6) — Have you attempted any IBS Mock Test Papers from ICAI?</label>
                    <RadioGroup
                      options={["Yes — attempted at least one", "No — haven't started yet"]}
                      value={watch("ibsMockAttempted")}
                      onChange={v => setValue("ibsMockAttempted", v)}
                    />
                  </div>
                )}

                {/* Q9 — Weakest chapters */}
                <Field label="Within your weakest subject — which specific chapters or standards feel most unclear?" span2>
                  <textarea
                    {...register("weakestChapters")}
                    rows={3}
                    placeholder="e.g. Ind AS 2 (Inventories), SA 560 (Subsequent Events), Section 43B (PGBP)..."
                    style={{ ...inputSx, resize: "vertical" }}
                  />
                </Field>

                {/* Q10 — Struggle type (updated options) */}
                <div style={{ marginBottom: 24 }}>
                  <label style={labelSx}>Do you tend to struggle more with:</label>
                  <RadioGroup
                    options={[
                      "Theory recall — I know the concepts but forget under exam pressure",
                      "Practical/numerical problems — calculations trip me up",
                      "Application/case study questions — I struggle to apply theory to scenarios",
                      ...(scheme === "new" ? ["IBS (Paper 6) integrated case studies — connecting multiple subjects"] : []),
                      "All equally",
                    ]}
                    value={watch("struggleType")}
                    onChange={v => setValue("struggleType", v)}
                  />
                </div>

                {/* Q11 — Time management */}
                <div style={{ marginBottom: 8 }}>
                  <label style={labelSx}>In mock tests, do you typically:</label>
                  <RadioGroup
                    options={["Run out of time", "Finish with time to spare", "Just about right"]}
                    value={watch("timeManagement")}
                    onChange={v => setValue("timeManagement", v)}
                  />
                </div>

                <div style={{ display: "flex", gap: 12, marginTop: 36 }}>
                  <button type="button" onClick={prevSection} className="btn-secondary">← Back</button>
                  <button type="button" onClick={nextSection} disabled={!canSection3} className="btn-primary"
                    style={{ opacity: canSection3 ? 1 : 0.35, cursor: canSection3 ? "pointer" : "not-allowed" }}>
                    Study Setup →
                  </button>
                </div>
              </div>
            )}

            {/* ── SECTION 4: Study Setup ── */}
            {section === 4 && (
              <div>
                <SectionHead
                  eyebrow="Section 4 — Study Setup"
                  title="How have you been preparing?"
                  sub="Last section. Two minutes, then your diagnostic is ready."
                  time="2 min"
                />

                {/* Q12 — Self-study or coaching */}
                <div style={{ marginBottom: 24 }}>
                  <label style={labelSx}>Are you self-studying, or following a coaching institute's plan?</label>
                  <RadioGroup
                    options={["Self-studying", "Following coaching plan", "Mix of both"]}
                    value={watch("studyMethod")}
                    onChange={v => setValue("studyMethod", v)}
                  />
                </div>

                {/* Q13 — Revision material */}
                <div style={{ marginBottom: 24 }}>
                  <label style={labelSx}>What revision material do you primarily use?</label>
                  <MultiCheck
                    options={["ICAI Study Material", "RTPs", "MTPs", "Coaching notes", "Past papers", "All of the above"]}
                    value={revisionMaterial}
                    onChange={v => setValue("revisionMaterial", v)}
                  />
                </div>

                {/* Q14 — Main reason */}
                <Field label="One sentence: what do you feel is the single biggest reason you haven't passed yet?" span2>
                  <textarea
                    {...register("mainReason", { required: true })}
                    rows={3}
                    placeholder="Be honest — the AI uses this to calibrate your report."
                    style={{ ...inputSx, resize: "vertical" }}
                  />
                </Field>

                <div style={{ display: "flex", gap: 12, marginTop: 36 }}>
                  <button type="button" onClick={prevSection} className="btn-secondary">← Back</button>
                  <button type="submit" className="btn-primary" style={{ padding: "14px 36px" }}>
                    Generate My Diagnostic Report →
                  </button>
                </div>
              </div>
            )}
          </form>
        )}
      </div>

      <style>{`
        @keyframes clarixPulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.25);opacity:0.8} }
        .logo-dot { animation: clarixPulse 2.8s ease-in-out infinite; transform-origin: center; }
        @keyframes dotbounce { 0%,100%{transform:translateY(0);opacity:.4} 50%{transform:translateY(-7px);opacity:1} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        input::placeholder, textarea::placeholder { color: #9CA3AF; }
        input:focus, select:focus, textarea:focus { border-color: #D4930A !important; }
        select option { background:#FFFFFF; color:#1C1917; }
        textarea { font-family: 'Space Grotesk', sans-serif !important; }
        @media (max-width: 640px) {
          nav { padding: 0 20px !important; }
          div[style*="max-width: 720px"] { padding: 40px 20px 60px !important; }
          .form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
