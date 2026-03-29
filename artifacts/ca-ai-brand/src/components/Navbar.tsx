import { Link } from "wouter";

export default function Navbar() {
  return (
    <nav className="nirnay-nav">
      <Link href="/" className="nirnay-logo" style={{ textDecoration: "none" }}>
        <div className="logo-dot" />
        NirnayAI
      </Link>
      <div className="nav-tag">Beta — Limited Access</div>
    </nav>
  );
}
