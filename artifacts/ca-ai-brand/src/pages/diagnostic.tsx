import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, useFieldArray } from "react-hook-form";
import { ArrowLeft, ArrowRight, Brain, Plus, Trash2, Loader2, FileText, ChevronDown, ChevronUp, AlertCircle, CheckCircle2, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { BrainAIDoodle, ChartDoodle, CalculatorDoodle } from "@/components/CaDoodles";

const CA_LEVELS: Record<string, { subjects: string[] }> = {
  "CA Foundation": {
    subjects: [
      "Principles and Practice of Accounting",
      "Business Laws & Business Correspondence",
      "Business Mathematics & Logical Reasoning",
      "Business Economics & Business & Commercial Knowledge",
    ],
  },
  "CA Intermediate (Group 1)": {
    subjects: [
      "Accounting",
      "Corporate & Other Laws",
      "Cost and Management Accounting",
      "Taxation",
    ],
  },
  "CA Intermediate (Group 2)": {
    subjects: [
      "Advanced Accounting",
      "Auditing and Assurance",
      "Enterprise Information Systems & Strategic Management",
      "Financial Management & Economics for Finance",
    ],
  },
  "CA Final (Group 1)": {
    subjects: [
      "Financial Reporting (FR)",
      "Strategic Financial Management (SFM)",
      "Advanced Auditing & Professional Ethics",
      "Corporate & Economic Laws",
    ],
  },
  "CA Final (Group 2)": {
    subjects: [
      "Strategic Cost Management & Performance Evaluation",
      "Elective Paper",
      "Direct Tax Laws & International Taxation",
      "Indirect Tax Laws (GST & Customs)",
    ],
  },
};

const WEAK_AREA_OPTIONS = [
  "Theory questions",
  "Practical problems / sums",
  "Time management in exam",
  "MCQ sections",
  "Case study questions",
  "Remembering standards (AS/Ind-AS)",
  "Amendments and recent changes",
  "Writing answers in proper format",
  "Revision — not enough time",
  "Conceptual clarity",
];

type SubjectEntry = {
  subject: string;
  score: string;
  maxScore: string;
};

type FormData = {
  name: string;
  email: string;
  examLevel: string;
  attemptNumber: string;
  studyHours: string;
  subjects: SubjectEntry[];
  weakAreas: string[];
};

function MarkdownReport({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        if (line.startsWith("## ")) {
          return (
            <h2 key={i} className="text-xl font-bold text-foreground mt-6 mb-2 border-b border-border pb-1">
              {line.replace("## ", "")}
            </h2>
          );
        }
        if (line.startsWith("### ")) {
          return <h3 key={i} className="text-lg font-semibold text-foreground mt-4 mb-1">{line.replace("### ", "")}</h3>;
        }
        if (line.startsWith("**") && line.endsWith("**")) {
          return <p key={i} className="font-bold text-foreground">{line.replace(/\*\*/g, "")}</p>;
        }
        if (line.startsWith("- ") || line.startsWith("* ")) {
          return (
            <div key={i} className="flex gap-2 items-start">
              <span className="text-primary mt-1 flex-shrink-0">•</span>
              <span className="text-muted-foreground text-sm" dangerouslySetInnerHTML={{
                __html: line.replace(/^[-*] /, "").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
              }} />
            </div>
          );
        }
        if (line.trim() === "") return <div key={i} className="h-2" />;
        return (
          <p key={i} className="text-muted-foreground text-sm leading-relaxed" dangerouslySetInnerHTML={{
            __html: line.replace(/\*\*(.*?)\*\*/g, "<strong class='text-foreground'>$1</strong>")
          }} />
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

  const { register, handleSubmit, watch, setValue, control, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      name: "",
      email: "",
      examLevel: "",
      attemptNumber: "1",
      studyHours: "",
      subjects: [],
      weakAreas: [],
    }
  });

  const { fields, replace } = useFieldArray({ control, name: "subjects" });

  const watchExamLevel = watch("examLevel");
  const watchWeakAreas = watch("weakAreas") || [];

  const handleLevelChange = (level: string) => {
    setValue("examLevel", level);
    const subs = CA_LEVELS[level]?.subjects || [];
    replace(subs.map(s => ({ subject: s, score: "", maxScore: "100" })));
  };

  const toggleWeakArea = (area: string) => {
    const current = watchWeakAreas;
    if (current.includes(area)) {
      setValue("weakAreas", current.filter(a => a !== area));
    } else {
      setValue("weakAreas", [...current, area]);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsAnalyzing(true);
    setReport("");
    setError("");
    setStep(3);

    try {
      const payload = {
        name: data.name,
        email: data.email,
        examLevel: data.examLevel,
        attemptNumber: parseInt(data.attemptNumber, 10) || 1,
        studyHours: data.studyHours || null,
        subjects: data.subjects.map(s => ({
          subject: s.subject,
          score: s.score ? parseInt(s.score, 10) : null,
          maxScore: parseInt(s.maxScore, 10) || 100,
        })),
        weakAreas: data.weakAreas,
      };

      const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
      const response = await fetch(`${BASE}/api/diagnostic/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Analysis failed. Please try again.");
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const parsed = JSON.parse(line.slice(6));
              if (parsed.content) {
                setReport(prev => prev + parsed.content);
              }
              if (parsed.done) {
                setDiagnosticId(parsed.id);
                setIsAnalyzing(false);
              }
            } catch {}
          }
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-navy py-6 px-4 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back to FinAI CA</span>
          </Link>
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            <span className="font-bold text-white text-lg">CA Diagnostic Tool</span>
          </div>
          <div className="text-white/50 text-sm">{step === 3 ? "Report" : `Step ${step}/2`}</div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <AnimatePresence mode="wait">
          {/* STEP 1 — About + Level */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              {/* Hero */}
              <div className="text-center mb-10 relative">
                <div className="absolute -top-4 left-4 opacity-10 hidden md:block">
                  <CalculatorDoodle className="w-16 h-16 text-primary" />
                </div>
                <div className="absolute -top-4 right-4 opacity-10 hidden md:block">
                  <BrainAIDoodle className="w-16 h-16 text-primary" />
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span className="text-primary text-xs font-semibold uppercase tracking-wider">AI-Powered · Built on ICAI Material</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-3">
                  Know <em className="text-primary not-italic">exactly</em> why you're failing.
                </h1>
                <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                  Enter your CA exam scores and get a precision diagnostic report — with a personalized study plan built on ICAI's own material.
                </p>
                <div className="flex justify-center gap-6 mt-6 text-sm text-muted-foreground">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">10–15%</div>
                    <div className="text-xs">CA Final pass rate</div>
                  </div>
                  <div className="w-px bg-border" />
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">3×</div>
                    <div className="text-xs">Average attempts before passing</div>
                  </div>
                  <div className="w-px bg-border" />
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">₹0</div>
                    <div className="text-xs">Cost to get your report</div>
                  </div>
                </div>
              </div>

              <form className="space-y-6">
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h3 className="font-bold text-foreground mb-4 flex items-center gap-2"><FileText size={16} className="text-primary" /> Your Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Full Name <span className="text-destructive">*</span></label>
                      <input {...register("name", { required: true })} placeholder="Bhargavi Sharma" className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Email <span className="text-destructive">*</span></label>
                      <input {...register("email", { required: true })} type="email" placeholder="you@example.com" className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Attempt Number</label>
                      <select {...register("attemptNumber")} className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm">
                        {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n === 1 ? "1st (First attempt)" : n === 2 ? "2nd" : n === 3 ? "3rd" : `${n}th`} attempt</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Weekly Study Hours</label>
                      <select {...register("studyHours")} className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm">
                        <option value="">Select...</option>
                        <option value="less than 4 hours">Less than 4 hrs/day</option>
                        <option value="4-6 hours">4–6 hrs/day</option>
                        <option value="6-8 hours">6–8 hrs/day</option>
                        <option value="8-10 hours">8–10 hrs/day</option>
                        <option value="10+ hours">10+ hrs/day</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-2xl p-6">
                  <h3 className="font-bold text-foreground mb-4 flex items-center gap-2"><Brain size={16} className="text-primary" /> Select Your CA Level</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.keys(CA_LEVELS).map(level => (
                      <motion.button
                        key={level}
                        type="button"
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleLevelChange(level)}
                        className={`p-4 rounded-xl border-2 text-left text-sm font-medium transition-all ${
                          watchExamLevel === level
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border text-muted-foreground hover:border-primary/40"
                        }`}
                      >
                        {level}
                      </motion.button>
                    ))}
                  </div>
                  {!watchExamLevel && <p className="text-muted-foreground text-xs mt-2">Select your CA level to enter subject marks</p>}
                </div>

                <motion.button
                  type="button"
                  disabled={!watchExamLevel || !watch("name") || !watch("email")}
                  onClick={() => setStep(2)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
                >
                  Enter Subject Marks <ArrowRight size={20} />
                </motion.button>
              </form>
            </motion.div>
          )}

          {/* STEP 2 — Marks + Weak areas */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <div className="flex items-center gap-3 mb-6">
                <button onClick={() => setStep(1)} className="p-2 rounded-lg border border-border hover:bg-muted transition-colors">
                  <ArrowLeft size={18} />
                </button>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Enter Your Subject Marks</h2>
                  <p className="text-muted-foreground text-sm">{watchExamLevel} — Leave score blank if paper wasn't attempted</p>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                  {fields.map((field, index) => (
                    <motion.div
                      key={field.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="grid grid-cols-12 gap-3 items-center"
                    >
                      <div className="col-span-7">
                        <p className="text-sm font-medium text-foreground">{field.subject}</p>
                        <p className="text-xs text-muted-foreground">Max: {watch(`subjects.${index}.maxScore`) || 100} marks</p>
                      </div>
                      <div className="col-span-3">
                        <input
                          {...register(`subjects.${index}.score`)}
                          type="number"
                          placeholder="Score"
                          min="0"
                          max="100"
                          className="w-full px-3 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm text-center"
                        />
                      </div>
                      <div className="col-span-2">
                        {watch(`subjects.${index}.score`) && (
                          <div className={`text-center text-xs font-bold px-2 py-1 rounded-lg ${
                            parseInt(watch(`subjects.${index}.score`), 10) >= 40
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}>
                            {parseInt(watch(`subjects.${index}.score`), 10) >= 40 ? "Pass" : "Fail"}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="bg-card border border-border rounded-2xl p-6">
                  <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                    <AlertCircle size={16} className="text-primary" />
                    What are your weak areas? (select all that apply)
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {WEAK_AREA_OPTIONS.map(area => {
                      const selected = watchWeakAreas.includes(area);
                      return (
                        <motion.button
                          key={area}
                          type="button"
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleWeakArea(area)}
                          className={`px-3 py-2 rounded-xl text-xs font-medium border-2 transition-all ${
                            selected
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border text-muted-foreground hover:border-primary/40"
                          }`}
                        >
                          {selected && "✓ "}{area}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-5 rounded-xl bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center gap-3 shadow-[0_0_40px_rgba(212,175,55,0.3)] hover:shadow-[0_0_60px_rgba(212,175,55,0.5)] transition-all"
                >
                  <Brain size={22} />
                  Generate My AI Diagnostic Report
                  <ArrowRight size={22} />
                </motion.button>
              </form>
            </motion.div>
          )}

          {/* STEP 3 — Report */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {isAnalyzing && !report && (
                <div className="text-center py-20">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="w-20 h-20 border-4 border-border border-t-primary rounded-full mx-auto mb-6" />
                  <h2 className="text-2xl font-bold text-foreground mb-2">AI is analysing your exam data...</h2>
                  <p className="text-muted-foreground">Studying your failure patterns against ICAI's marking schemes</p>
                  <div className="flex justify-center gap-4 mt-6 text-sm text-muted-foreground">
                    {["Scanning subject scores", "Identifying failure patterns", "Building precision plan"].map((t, i) => (
                      <motion.span key={t} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 2, delay: i * 0.5 }} className="flex items-center gap-1.5">
                        <Loader2 size={12} className="animate-spin" /> {t}
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-6 text-center">
                  <AlertCircle className="w-10 h-10 text-destructive mx-auto mb-3" />
                  <h3 className="font-bold text-foreground mb-1">Analysis failed</h3>
                  <p className="text-muted-foreground text-sm mb-4">{error}</p>
                  <button onClick={() => setStep(1)} className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm">
                    Try Again
                  </button>
                </div>
              )}

              {report && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="flex items-center gap-3 mb-6 bg-green-50 border border-green-200 rounded-2xl p-4">
                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-green-800">Your diagnostic report is ready!</p>
                      <p className="text-green-700 text-sm">Personalized analysis based on ICAI's exam patterns{diagnosticId ? ` · Report ID: #${diagnosticId}` : ""}</p>
                    </div>
                  </div>

                  <div className="bg-card border border-border rounded-2xl p-8">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
                      <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                        <Brain size={20} className="text-primary-foreground" />
                      </div>
                      <div>
                        <h2 className="font-bold text-foreground">AI Diagnostic Report</h2>
                        <p className="text-muted-foreground text-sm">{watch("examLevel")} · Attempt #{watch("attemptNumber")}</p>
                      </div>
                      <div className="ml-auto flex items-center gap-1 text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full border border-primary/20">
                        <Sparkles size={12} />
                        Built on ICAI Material
                      </div>
                    </div>

                    {isAnalyzing ? (
                      <div>
                        <MarkdownReport text={report} />
                        <motion.div animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="inline-block w-0.5 h-5 bg-primary ml-1 align-middle" />
                      </div>
                    ) : (
                      <MarkdownReport text={report} />
                    )}
                  </div>

                  <div className="mt-6 flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => { setStep(1); setReport(""); setDiagnosticId(null); }}
                      className="flex-1 py-3 rounded-xl border border-border text-foreground font-medium hover:bg-muted transition-all text-sm"
                    >
                      Start a New Diagnostic
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center gap-2"
                    >
                      <FileText size={16} /> Save Report as PDF
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
