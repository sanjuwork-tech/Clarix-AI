import { useState } from "react";
import { Link } from "wouter";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 h-12 flex items-center justify-between">
        <Link href="/" className="font-sans font-semibold text-sm tracking-tight text-foreground">
          N%rmayAI
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <a href="#problem" className="text-[12px] text-muted-foreground hover:text-foreground transition-colors">The Problem</a>
          <a href="#how-it-works" className="text-[12px] text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
          <a href="#built-on" className="text-[12px] text-muted-foreground hover:text-foreground transition-colors">About</a>
          <Link href="/diagnostic" className="text-[12px] text-muted-foreground hover:text-foreground transition-colors">CA Diagnostic</Link>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 border border-border rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-medium text-muted-foreground tracking-widest uppercase">Meta · Limited Access</span>
          </div>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-1.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <div className="space-y-1">
              <div className="w-4 h-px bg-current" />
              <div className="w-4 h-px bg-current" />
            </div>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="max-w-5xl mx-auto px-5 py-4 flex flex-col gap-3">
            <a href="#problem" onClick={() => setMenuOpen(false)} className="text-sm text-muted-foreground">The Problem</a>
            <a href="#how-it-works" onClick={() => setMenuOpen(false)} className="text-sm text-muted-foreground">How It Works</a>
            <a href="#built-on" onClick={() => setMenuOpen(false)} className="text-sm text-muted-foreground">About</a>
            <Link href="/diagnostic" onClick={() => setMenuOpen(false)} className="text-sm text-muted-foreground">CA Diagnostic</Link>
          </div>
        </div>
      )}
    </header>
  );
}
