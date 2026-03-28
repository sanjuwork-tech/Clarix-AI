import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "The Problem", href: "#problem" },
    { name: "AI Services", href: "#services" },
    { name: "Market Insight", href: "#market" },
    { name: "About", href: "#about" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass-panel py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2 cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-display font-bold text-xl shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
              F
            </div>
            <span className={`font-display font-bold text-2xl tracking-tight ${isScrolled ? 'text-foreground' : 'text-white'}`}>
              FinAI<span className="text-primary">CA</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-sm font-medium hover:text-primary transition-colors ${
                  isScrolled ? 'text-muted-foreground' : 'text-white/80 hover:text-white'
                }`}
              >
                {link.name}
              </a>
            ))}
            <a
              href="#waitlist"
              className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              Join Waitlist
            </a>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-foreground p-2 bg-background/50 rounded-lg backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 w-full bg-background border-b border-border shadow-xl md:hidden"
        >
          <div className="flex flex-col p-4 gap-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-foreground font-medium p-2 hover:bg-muted rounded-lg"
              >
                {link.name}
              </a>
            ))}
            <a
              href="#waitlist"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold mt-2"
            >
              Join Waitlist
            </a>
          </div>
        </motion.div>
      )}
    </header>
  );
}
