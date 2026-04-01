import { Link } from "wouter";

export default function NotFound() {
  return (
    <div style={{
      minHeight: "100vh", background: "#FAF8F4", display: "flex",
      alignItems: "center", justifyContent: "center", fontFamily: "'Space Grotesk', sans-serif",
    }}>
      <div style={{ textAlign: "center", padding: "40px 24px" }}>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 11,
          color: "#D4930A", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 20,
        }}>
          404 — Page not found
        </div>
        <h1 style={{ fontSize: 48, fontWeight: 700, color: "#1C1917", letterSpacing: "-0.03em", marginBottom: 12 }}>
          Wrong turn.
        </h1>
        <p style={{ fontSize: 15, color: "#78716C", lineHeight: 1.7, maxWidth: 320, margin: "0 auto 32px" }}>
          This page doesn't exist. Let's get you back to your diagnostic.
        </p>
        <Link href="/" style={{
          display: "inline-block", padding: "12px 28px",
          background: "#1C1917", color: "#FAF8F4",
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 11,
          letterSpacing: ".08em", textTransform: "uppercase",
          borderRadius: 8, textDecoration: "none",
          border: "2px solid #1C1917",
        }}>
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
