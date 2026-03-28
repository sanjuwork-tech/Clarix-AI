import { motion } from "framer-motion";

export function CalculatorDoodle({ className = "" }: { className?: string }) {
  return (
    <motion.svg
      className={className}
      viewBox="0 0 80 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      animate={{ rotate: [0, 3, -3, 0] }}
      transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
    >
      <rect x="5" y="5" width="70" height="90" rx="8" stroke="currentColor" strokeWidth="2.5" strokeDasharray="4 2" />
      <rect x="14" y="14" width="52" height="18" rx="4" stroke="currentColor" strokeWidth="2" />
      <text x="26" y="27" fontSize="10" fill="currentColor" fontFamily="monospace">3.14%</text>
      <rect x="14" y="40" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="34" y="40" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="54" y="40" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="14" y="57" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="34" y="57" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="54" y="57" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="14" y="74" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="34" y="74" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="54" y="74" width="12" height="22" rx="2" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="1.5" />
    </motion.svg>
  );
}

export function BrainAIDoodle({ className = "" }: { className?: string }) {
  return (
    <motion.svg
      className={className}
      viewBox="0 0 100 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      animate={{ scale: [1, 1.04, 1] }}
      transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
    >
      <path d="M50 15 C30 15 15 28 15 44 C15 55 22 64 33 68 L33 78 L67 78 L67 68 C78 64 85 55 85 44 C85 28 70 15 50 15Z" stroke="currentColor" strokeWidth="2.5" strokeDasharray="5 2" />
      <path d="M35 44 C35 38 40 34 47 34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M65 44 C65 38 60 34 53 34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="40" cy="50" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="60" cy="50" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="50" cy="40" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M43 50 L47 40" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M57 50 L53 40" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M44 50 L56 50" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <motion.circle cx="26" cy="38" r="2" fill="currentColor" animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 0 }} />
      <motion.circle cx="74" cy="38" r="2" fill="currentColor" animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 0.5 }} />
      <motion.circle cx="50" cy="20" r="2" fill="currentColor" animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 1 }} />
      <text x="33" y="88" fontSize="9" fill="currentColor" fontFamily="monospace" opacity="0.8">AI ENGINE</text>
    </motion.svg>
  );
}

export function ChartDoodle({ className = "" }: { className?: string }) {
  return (
    <motion.svg
      className={className}
      viewBox="0 0 90 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      animate={{ y: [0, -4, 0] }}
      transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
    >
      <path d="M10 70 L80 70" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M10 70 L10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <motion.path
        d="M10 60 L28 48 L46 32 L64 20 L82 10"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="200"
        strokeDashoffset="200"
        animate={{ strokeDashoffset: 0 }}
        transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatDelay: 3 }}
      />
      <rect x="16" y="50" width="10" height="20" rx="2" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="34" y="38" width="10" height="32" rx="2" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="52" y="24" width="10" height="46" rx="2" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="70" y="14" width="10" height="56" rx="2" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 50 L9 50" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 30 L9 30" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 10 L9 10" stroke="currentColor" strokeWidth="1.5" />
    </motion.svg>
  );
}

export function DocumentDoodle({ className = "" }: { className?: string }) {
  return (
    <motion.svg
      className={className}
      viewBox="0 0 70 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      animate={{ rotate: [-2, 2, -2] }}
      transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
    >
      <path d="M8 8 L48 8 L62 22 L62 82 L8 82 Z" stroke="currentColor" strokeWidth="2.5" strokeDasharray="4 2" />
      <path d="M48 8 L48 22 L62 22" stroke="currentColor" strokeWidth="2" />
      <path d="M18 36 L52 36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 46 L52 46" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 56 L40 56" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="22" cy="68" r="5" stroke="currentColor" strokeWidth="2" />
      <path d="M20 68 L21.5 69.5 L25 66" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <text x="14" y="26" fontSize="8" fill="currentColor" fontFamily="monospace" opacity="0.7">ITR-3</text>
    </motion.svg>
  );
}

export function GearDoodle({ className = "" }: { className?: string }) {
  return (
    <motion.svg
      className={className}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
    >
      <path
        d="M40 28 C33.4 28 28 33.4 28 40 C28 46.6 33.4 52 40 52 C46.6 52 52 46.6 52 40 C52 33.4 46.6 28 40 28Z"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <path d="M40 20 L40 14 M40 60 L40 66 M20 40 L14 40 M60 40 L66 40 M26.1 26.1 L21.9 21.9 M53.9 53.9 L58.1 58.1 M53.9 26.1 L58.1 21.9 M26.1 53.9 L21.9 58.1"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="37" y="11" width="6" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="37" y="61" width="6" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="11" y="37" width="8" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="61" y="37" width="8" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    </motion.svg>
  );
}

export function FloatingDoodles() {
  return (
    <div className="pointer-events-none select-none absolute inset-0 overflow-hidden">
      <CalculatorDoodle className="absolute top-[12%] left-[4%] w-14 h-14 text-primary/20 hidden lg:block" />
      <BrainAIDoodle className="absolute top-[20%] right-[5%] w-16 h-16 text-primary/20 hidden lg:block" />
      <ChartDoodle className="absolute bottom-[25%] left-[3%] w-16 h-16 text-primary/15 hidden lg:block" />
      <DocumentDoodle className="absolute bottom-[15%] right-[4%] w-12 h-12 text-primary/15 hidden lg:block" />
      <GearDoodle className="absolute top-[55%] left-[7%] w-10 h-10 text-white/10 hidden xl:block" />
      <GearDoodle className="absolute top-[40%] right-[8%] w-7 h-7 text-white/10 hidden xl:block" />
    </div>
  );
}
