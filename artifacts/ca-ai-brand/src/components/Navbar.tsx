import { Link } from "wouter";

export default function Navbar() {
  return (
    <nav className="clarix-nav">
      <Link href="/" className="clarix-logo" style={{ textDecoration: "none" }}>
        {/* Clarix mark: 300° arc, gap at 2 o'clock */}
        <svg width="26" height="26" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <path
            d="M 26 16 A 10 10 0 1 1 21 7.34"
            stroke="#D4930A"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle
            className="logo-dot"
            cx="24.66"
            cy="11"
            r="3"
            fill="#D4930A"
          />
        </svg>
        Clarix<span className="clarix-logo-ai">.AI</span>
      </Link>
      <div className="nav-tag">Beta — Limited Access</div>
    </nav>
  );
}
