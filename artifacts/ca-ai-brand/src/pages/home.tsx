import { useRef, useEffect } from "react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";

/* ── SVG doodle: Open ledger book (problem section bg accent) ── */
const LedgerDoodle = () => (
  <svg width="220" height="165" viewBox="0 0 120 90" fill="none"
    xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
    style={{ position: "absolute", right: "4%", bottom: "10%", opacity: 0.055, pointerEvents: "none", userSelect: "none" }}>
    <line x1="60" y1="10" x2="60" y2="82" stroke="#1C1917" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M60,12 Q30,8 18,15 L18,80 Q30,74 60,78" stroke="#1C1917" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M60,12 Q90,8 102,15 L102,80 Q90,74 60,78" stroke="#1C1917" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="26" y1="30" x2="54" y2="28" stroke="#1C1917" strokeWidth="0.8" opacity="0.6"/>
    <line x1="26" y1="40" x2="54" y2="38" stroke="#1C1917" strokeWidth="0.8" opacity="0.6"/>
    <line x1="26" y1="50" x2="54" y2="48" stroke="#1C1917" strokeWidth="0.8" opacity="0.6"/>
    <line x1="26" y1="60" x2="54" y2="58" stroke="#1C1917" strokeWidth="0.8" opacity="0.6"/>
    <line x1="66" y1="28" x2="94" y2="30" stroke="#1C1917" strokeWidth="0.8" opacity="0.6"/>
    <line x1="66" y1="38" x2="94" y2="40" stroke="#1C1917" strokeWidth="0.8" opacity="0.6"/>
    <line x1="66" y1="48" x2="94" y2="50" stroke="#1C1917" strokeWidth="0.8" opacity="0.6"/>
    <line x1="66" y1="58" x2="94" y2="60" stroke="#1C1917" strokeWidth="0.8" opacity="0.6"/>
  </svg>
);

/* ── SVG doodle: Neural network (trust section bg accent) ── */
const NeuralDoodle = () => (
  <svg width="200" height="200" viewBox="0 0 100 100" fill="none"
    xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
    style={{ position: "absolute", left: "2%", top: "15%", opacity: 0.055, pointerEvents: "none", userSelect: "none" }}>
    <circle cx="50" cy="50" r="6" stroke="#1C1917" strokeWidth="1.2"/>
    <circle cx="50" cy="18" r="4" stroke="#1C1917" strokeWidth="1"/>
    <circle cx="78" cy="32" r="4" stroke="#1C1917" strokeWidth="1"/>
    <circle cx="78" cy="68" r="4" stroke="#1C1917" strokeWidth="1"/>
    <circle cx="50" cy="82" r="4" stroke="#1C1917" strokeWidth="1"/>
    <circle cx="22" cy="68" r="4" stroke="#1C1917" strokeWidth="1"/>
    <circle cx="22" cy="32" r="4" stroke="#1C1917" strokeWidth="1"/>
    <line x1="50" y1="44" x2="50" y2="22" stroke="#1C1917" strokeWidth="0.9" strokeLinecap="round"/>
    <line x1="56" y1="46" x2="74" y2="35" stroke="#1C1917" strokeWidth="0.9" strokeLinecap="round"/>
    <line x1="56" y1="54" x2="74" y2="65" stroke="#1C1917" strokeWidth="0.9" strokeLinecap="round"/>
    <line x1="50" y1="56" x2="50" y2="78" stroke="#1C1917" strokeWidth="0.9" strokeLinecap="round"/>
    <line x1="44" y1="54" x2="26" y2="65" stroke="#1C1917" strokeWidth="0.9" strokeLinecap="round"/>
    <line x1="44" y1="46" x2="26" y2="35" stroke="#1C1917" strokeWidth="0.9" strokeLinecap="round"/>
  </svg>
);

export default function Home() {
  const howRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  /* ── Intersection observer for heading-underline reveal ── */
  useEffect(() => {
    const els = document.querySelectorAll(".heading-underline");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("revealed"); obs.unobserve(e.target); } }),
      { threshold: 0.4 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const border   = "var(--c-border)";
  const muted    = "var(--c-muted)";
  const amber    = "var(--c-amber)";
  const charcoal = "var(--c-charcoal)";
  const surface  = "var(--c-surface)";
  const parchment = "var(--c-parchment)";
  const white    = "var(--c-white)";

  return (
    <div className="clarix-page" style={{ minHeight: "100vh" }}>
      <Navbar />

      {/* ── HERO ───────────────────────────────────────────── */}
      <section style={{ padding: "80px 40px 64px", borderBottom: `1px solid ${border}` }}>
        <div className="animate-in" style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: amber,
          letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 28,
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <span style={{ display: "inline-block", width: 24, height: 1, background: amber }} />
          AI-powered CA Final diagnostics
        </div>

        <h1 className="clarix-h1 animate-in" style={{ animationDelay: "80ms" }}>
          Know <em className="clarix-em">exactly</em> why you're failing.<br />Fix it.
        </h1>

        <p className="animate-in" style={{ animationDelay: "160ms", fontSize: 15, color: muted, lineHeight: 1.7, maxWidth: 440, margin: "24px 0 40px" }}>
          Most CA repeaters study more of the same thing that failed them the last time.
          Clarix.ai analyses your weaknesses at the question-type level — mapped to ICAI's
          own papers — and builds a precision plan around them.
        </p>

        <div className="animate-in" style={{ animationDelay: "240ms", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
          <button className="btn-primary" onClick={() => scrollTo(ctaRef)}>
            Get Your Free Diagnostic →
          </button>
          <button className="btn-ghost" onClick={() => scrollTo(howRef)}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" />
            </svg>
            See how it works
          </button>
        </div>

        <p className="price-note" style={{ marginTop: 18 }}>
          First 50 aspirants only · Normally{" "}
          <s style={{ opacity: 0.6 }}>₹499</s>{" "}
          · ICAI-specific, not generic AI
        </p>
      </section>

      {/* ── STATS ──────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", borderBottom: `1px solid ${border}` }}>
        {[
          { num: "10", sup: "–15%", label: "CA Final pass rate per attempt. The exam is designed to fail most." },
          { num: "3",  sup: "×",    label: "Average attempts before passing. That's 18+ months of lost time." },
          { num: "₹0", sup: "",     label: "Tools that tell you exactly why you failed your last paper." },
        ].map((s, i) => (
          <div key={i} style={{
            padding: "28px 36px",
            borderRight: i < 2 ? `1px solid ${border}` : undefined,
            background: surface,
          }}>
            <div className="stat-num-serif">
              {s.num}
              {s.sup && <span style={{ color: amber, fontSize: 26 }}>{s.sup}</span>}
            </div>
            <div style={{ fontSize: 13, color: muted, lineHeight: 1.55 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── PROBLEM ────────────────────────────────────────── */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        <LedgerDoodle />
        <div style={{
          padding: "64px 40px", borderBottom: `1px solid ${border}`,
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "start",
        }}
          className="responsive-two-col"
        >
          <div>
            <span className="section-label">The problem</span>
            <h2 className="clarix-h2">
              You're not failing because you're not studying{" "}
              <em className="clarix-em heading-underline">enough.</em>
            </h2>
            <p style={{ fontSize: 15, color: muted, lineHeight: 1.7 }}>
              You're failing because you don't know what to study differently. Every
              coaching platform sells you more content — more videos, more notes, more mock
              tests. None of them diagnose you. Clarix.ai does.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {[
              {
                n: "01", title: "Concept gaps aren't visible",
                body: "You score 35 in Audit and don't know if it's Ind AS confusion, SA misapplication, or time pressure. Generic mock reports don't tell you.",
              },
              {
                n: "02", title: "Question-type failures are ignored",
                body: "CA papers test judgment, not recall. If you're strong on theory but weak on application questions, no test series will catch that pattern.",
              },
              {
                n: "03", title: "Revision is inefficient by default",
                body: "With 8 subjects, every student revises everything equally. That's precisely wrong — and it costs you attempts.",
              },
            ].map((item, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "flex-start", gap: 16,
                padding: "20px 0", borderBottom: `1px solid ${border}`,
                borderTop: i === 0 ? `1px solid ${border}` : undefined,
              }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: amber, marginTop: 3, minWidth: 24, letterSpacing: ".06em" }}>
                  {item.n}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 500, color: charcoal, marginBottom: 5, letterSpacing: "-0.01em" }}>{item.title}</div>
                  <div style={{ fontSize: 14, color: muted, lineHeight: 1.65 }}>{item.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── HOW IT WORKS ───────────────────────────────────── */}
      <div ref={howRef} style={{ padding: "64px 40px", borderBottom: `1px solid ${border}`, background: surface }}>
        <span className="section-label">How it works</span>
        <h2 className="clarix-h2">
          Three steps. One{" "}
          <em className="clarix-em heading-underline">clear</em> plan.
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginTop: 36 }}
          className="responsive-three-col"
        >
          {[
            {
              step: "STEP 01", title: "You share your attempt data",
              body: "Fill a 10-minute intake form — past attempt scores, subjects appearing for, specific topics you find hard. No uploads needed.",
              tag: "10 min intake",
            },
            {
              step: "STEP 02", title: "AI analyses your failure pattern",
              body: "Clarix.ai cross-references your data against ICAI past papers, RTPs, and MTP patterns to identify your exact weakness profile.",
              tag: "ICAI-mapped AI",
            },
            {
              step: "STEP 03", title: "You get a precision study plan",
              body: "A personalised 30/60/90-day plan with topic prioritisation and question-type drills — calibrated to your actual exam date.",
              tag: "Delivered in 48hrs",
            },
          ].map((s, i) => (
            <div key={i} className="step-card">
              <div className="step-num-tag">{s.step}</div>
              <div className="step-title">{s.title}</div>
              <div style={{ fontSize: 14, color: muted, lineHeight: 1.65 }}>{s.body}</div>
              <div className="step-tag">{s.tag}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── WHY TRUST ──────────────────────────────────────── */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        <NeuralDoodle />
        <div style={{
          padding: "64px 40px", borderBottom: `1px solid ${border}`,
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "start",
        }}
          className="responsive-two-col"
        >
          <div>
            <span className="section-label">Why trust this</span>
            <h2 className="clarix-h2">
              Built on{" "}
              <em className="clarix-em heading-underline">ICAI's</em>{" "}
              own material. Nothing else.
            </h2>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 24, marginBottom: 28 }}>
              {["BCom graduate", "CA aspirant", "AI researcher", "ICAI curriculum specialist"].map((tag) => (
                <span key={tag} className="trust-pill">{tag}</span>
              ))}
            </div>

            <p style={{ fontSize: 15, color: muted, lineHeight: 1.7 }}>
              Clarix.ai was built by a BCom graduate and CA aspirant who experienced the
              preparation gap firsthand — and spent months mapping ICAI's exam patterns,
              past papers, and marking schemes using AI. The diagnostic is grounded entirely
              in ICAI's published material: study material, RTPs, MTPs, and suggested
              answers. Not generic AI. Not assumptions. The same sources ICAI uses to set
              the papers.
            </p>
          </div>

          <div className="insight-card">
            <span className="insight-label">What the diagnostic is built on</span>
            {[
              { text: "ICAI CA Final past papers — last 10 attempts", sub: "Both Group 1 and Group 2, all papers mapped by question type." },
              { text: "ICAI Revision Test Papers (RTPs) and Mock Test Papers (MTPs)", sub: "Pattern-analysed across attempts to identify high-weight topics." },
              { text: "ICAI suggested answers and marking schemes", sub: "Understand exactly what the examiner awards marks for." },
              { text: "AI trained to distinguish recall vs application gaps", sub: "The question-type split that no coaching platform diagnoses." },
            ].map((item, i) => (
              <div key={i} style={{
                display: "flex", gap: 14, padding: "14px 0",
                borderBottom: i < 3 ? `1px solid ${border}` : undefined,
              }}>
                <div className="insight-dot" />
                <div>
                  <div style={{ fontSize: 14, color: charcoal, lineHeight: 1.6, fontWeight: 500 }}>{item.text}</div>
                  <div style={{ fontSize: 13, color: muted, marginTop: 3 }}>{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── DISCLAIMER ─────────────────────────────────────── */}
      <div style={{
        margin: "0", padding: "20px 40px",
        background: "#FFFBF2",
        borderTop: `1px solid rgba(212,147,10,0.2)`,
        borderBottom: `1px solid rgba(212,147,10,0.2)`,
        borderLeft: `4px solid var(--c-amber)`,
        display: "flex", alignItems: "flex-start", gap: 14,
      }}>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, fontWeight: 500,
          color: amber, flexShrink: 0, paddingTop: 1,
          background: "rgba(212,147,10,0.12)", padding: "2px 7px", borderRadius: 3,
          letterSpacing: ".04em",
        }}>!</div>
        <p style={{ fontSize: 13, color: muted, lineHeight: 1.7 }}>
          <strong style={{ color: charcoal, fontWeight: 600 }}>Full transparency:</strong>{" "}
          Clarix.ai is an AI-powered diagnostic tool built by a BCom graduate and CA aspirant —
          not a registered Chartered Accountant or a CA coaching institute. The diagnostic
          analyses ICAI exam patterns using AI and is reviewed for quality before delivery.
          It is not a substitute for professional CA guidance or ICAI-approved coaching.
          Results are study planning recommendations, not guaranteed outcomes.
        </p>
      </div>

      {/* ── CTA ────────────────────────────────────────────── */}
      <div ref={ctaRef} style={{ padding: "88px 40px", textAlign: "center", background: parchment }}>
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <div className="cta-price">
            Launch offer ·{" "}
            <span style={{ color: "var(--c-amber-lt)" }}>Free for first 50 aspirants</span>{" "}
            · Normally <s style={{ opacity: 0.55 }}>₹499</s>
          </div>
          <div className="cta-h">Get your diagnostic report.</div>
          <p style={{ fontSize: 15, color: muted, lineHeight: 1.7, marginBottom: 36 }}>
            Stop revising blindly. Find out exactly which gaps are costing you marks —
            and get a plan that fixes them before your next attempt.
          </p>
          <Link href="/diagnostic">
            <button className="btn-primary" style={{ fontSize: 13, padding: "16px 40px" }}>
              Start Free Diagnostic →
            </button>
          </Link>
          <p className="price-note" style={{ marginTop: 16 }}>
            Delivered within 48 hours ·{" "}
            <span className="price-note-amber">ICAI-mapped AI analysis</span>{" "}
            · First 50 aspirants only
          </p>
        </div>
      </div>

      {/* ── FOOTER ─────────────────────────────────────────── */}
      <footer style={{
        padding: "22px 40px", borderTop: `1px solid ${border}`,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: muted,
        flexWrap: "wrap", gap: 8, background: white,
      }}>
        <span>© 2025 Clarix.ai</span>
        <span>AI-powered · ICAI-grounded · Built by a CA aspirant</span>
      </footer>

      <style>{`
        @media (max-width: 640px) {
          .responsive-two-col { grid-template-columns: 1fr !important; gap: 40px !important; }
          .responsive-three-col { grid-template-columns: 1fr !important; }
          section, .clarix-nav,
          div[style*="padding: 64px 40px"],
          div[style*="padding: 80px 40px"],
          div[style*="padding: 88px 40px"],
          div[style*="padding: 28px 36px"],
          div[style*="padding: 20px 40px"],
          div[style*="padding: 22px 40px"],
          footer { padding-left: 20px !important; padding-right: 20px !important; }
        }
      `}</style>
    </div>
  );
}
