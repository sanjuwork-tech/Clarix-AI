import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Loader2, X, ClipboardList, CheckCircle2, ChevronRight, ArrowRight } from "lucide-react";
import { BrainAIDoodle, CalculatorDoodle, ChartDoodle } from "./CaDoodles";

const SERVICES = [
  "CA Exam AI Tutor",
  "Tax Filing Assistant",
  "Audit AI Assistant",
  "Compliance Tracker",
  "Financial Advisory AI",
  "CA Practice Management",
];

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.string().min(1, "Please enter your age"),
  gender: z.string().min(1, "Please select your gender"),
  qualification: z.string().min(1, "Please select your qualification"),
  qualificationOther: z.string().optional(),
  services: z.array(z.string()).min(1, "Please select at least one service"),
  experience: z.string().optional(),
  ideas: z.string().min(5, "Please share at least a brief thought"),
});

type FormData = z.infer<typeof formSchema>;

function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="w-full bg-white/10 rounded-full h-1.5 mb-6">
      <motion.div
        className="h-1.5 rounded-full bg-primary"
        animate={{ width: `${(step / total) * 100}%` }}
        transition={{ duration: 0.4 }}
      />
    </div>
  );
}

function SurveyModal({ onClose }: { onClose: () => void }) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const totalSteps = 3;

  const { register, handleSubmit, watch, setValue, trigger, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { services: [] },
  });

  const watchServices = watch("services") || [];
  const watchQualification = watch("qualification");

  const toggleService = (service: string) => {
    const current = watchServices;
    if (current.includes(service)) {
      setValue("services", current.filter((s) => s !== service));
    } else {
      setValue("services", [...current, service]);
    }
  };

  const nextStep = async () => {
    let fields: (keyof FormData)[] = [];
    if (step === 1) fields = ["name", "age", "gender", "qualification"];
    if (step === 2) fields = ["services"];
    const valid = await trigger(fields);
    if (valid) setStep((s) => s + 1);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
      const res = await fetch(`${BASE}/api/survey`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to save");
      setSubmitted(true);
      toast({
        title: "Survey Submitted!",
        description: "Your feedback will shape FinAI CA. Thank you!",
      });
    } catch {
      toast({
        title: "Submission failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute inset-0 bg-secondary/80 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
      <motion.div
        className="relative z-10 w-full max-w-2xl bg-card rounded-3xl shadow-2xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      >
        <div className="bg-gradient-navy px-8 pt-8 pb-6 relative overflow-hidden">
          <div className="absolute top-2 right-16 opacity-20">
            <CalculatorDoodle className="w-14 h-14 text-primary" />
          </div>
          <div className="absolute bottom-0 left-6 opacity-15">
            <ChartDoodle className="w-12 h-12 text-primary" />
          </div>
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all">
            <X size={20} />
          </button>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <ClipboardList size={20} className="text-primary-foreground" />
            </div>
            <div>
              <p className="text-white/60 text-xs uppercase tracking-widest font-medium">Quick Survey</p>
              <h2 className="text-white font-bold text-xl">Help us build FinAI CA for you</h2>
            </div>
          </div>
          <ProgressBar step={step} total={totalSteps} />
          <p className="text-white/50 text-xs">Step {step} of {totalSteps}</p>
        </div>

        <div className="p-8">
          {submitted ? (
            <motion.div className="text-center py-8" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
              <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 0.6 }} className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </motion.div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Thank you, {watch("name")}!</h3>
              <p className="text-muted-foreground mb-6">Your inputs will directly shape the services we build. We'll keep you in the loop!</p>
              <button onClick={onClose} className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity">
                Close
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
                    <h3 className="text-lg font-bold text-foreground mb-4">Tell us about yourself</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">Full Name <span className="text-destructive">*</span></label>
                        <input {...register("name")} placeholder="Bhargavi Sharma" className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm" />
                        {errors.name && <p className="text-destructive text-xs mt-1">{errors.name.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">Age <span className="text-destructive">*</span></label>
                        <input {...register("age")} type="number" placeholder="24" min="14" max="80" className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm" />
                        {errors.age && <p className="text-destructive text-xs mt-1">{errors.age.message}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Gender <span className="text-destructive">*</span></label>
                      <div className="flex gap-3">
                        {["Male", "Female", "Non-binary", "Prefer not to say"].map((g) => (
                          <label key={g} className="flex-1 cursor-pointer">
                            <input type="radio" {...register("gender")} value={g} className="sr-only peer" />
                            <div className="text-center py-2.5 px-2 rounded-xl border border-border peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:text-primary text-muted-foreground text-xs font-medium transition-all hover:border-primary/50 whitespace-nowrap">
                              {g}
                            </div>
                          </label>
                        ))}
                      </div>
                      {errors.gender && <p className="text-destructive text-xs mt-1">{errors.gender.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Your Role / Qualification <span className="text-destructive">*</span></label>
                      <select {...register("qualification")} className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm">
                        <option value="">Select your role...</option>
                        <option value="CA Student (Foundation)">CA Student — Foundation</option>
                        <option value="CA Student (Intermediate)">CA Student — Intermediate</option>
                        <option value="CA Student (Final)">CA Student — Final</option>
                        <option value="Practicing CA">Practicing CA / CA Professional</option>
                        <option value="Employee">Employee (Accounts / Finance)</option>
                        <option value="CFO">CFO / Finance Head</option>
                        <option value="CEO">CEO / Business Owner</option>
                        <option value="CMA Student">CMA Student</option>
                        <option value="CS Student">CS (Company Secretary) Student</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.qualification && <p className="text-destructive text-xs mt-1">{errors.qualification.message}</p>}
                    </div>
                    {watchQualification === "Other" && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                        <label className="block text-sm font-medium text-foreground mb-1.5">Please specify</label>
                        <input {...register("qualificationOther")} placeholder="Your role or qualification..." className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm" />
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
                    <h3 className="text-lg font-bold text-foreground mb-1">Which AI services do you need?</h3>
                    <p className="text-muted-foreground text-sm mb-4">Select all that apply — this shapes our product roadmap.</p>
                    <div className="grid grid-cols-2 gap-3">
                      {SERVICES.map((service) => {
                        const checked = watchServices.includes(service);
                        return (
                          <motion.button key={service} type="button" onClick={() => toggleService(service)} whileTap={{ scale: 0.97 }}
                            className={`text-left p-4 rounded-xl border-2 transition-all text-sm font-medium flex items-start gap-3 ${checked ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"}`}>
                            <div className={`mt-0.5 w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all ${checked ? "border-primary bg-primary" : "border-muted-foreground/50"}`}>
                              {checked && <span className="text-primary-foreground text-[10px] font-bold">✓</span>}
                            </div>
                            {service}
                          </motion.button>
                        );
                      })}
                    </div>
                    {errors.services && <p className="text-destructive text-xs">{errors.services.message}</p>}
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-foreground mb-1.5">Years of experience in CA / Finance field</label>
                      <select {...register("experience")} className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm">
                        <option value="">Select...</option>
                        <option value="Student / 0 years">Student / 0 years</option>
                        <option value="Less than 1 year">Less than 1 year</option>
                        <option value="1–3 years">1–3 years</option>
                        <option value="3–7 years">3–7 years</option>
                        <option value="7+ years">7+ years</option>
                      </select>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="step3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                      <BrainAIDoodle className="w-12 h-12 text-primary" />
                      <div>
                        <h3 className="text-lg font-bold text-foreground">Your ideas matter most!</h3>
                        <p className="text-muted-foreground text-sm">Help us understand your real challenges.</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">What's the biggest challenge in your CA / finance journey? <span className="text-destructive">*</span></label>
                      <textarea {...register("ideas")} placeholder="e.g. I struggle with keeping up with GST amendments, remembering AS/Ind-AS standards..." rows={5} className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm resize-none" />
                      {errors.ideas && <p className="text-destructive text-xs mt-1">{errors.ideas.message}</p>}
                    </div>
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm text-muted-foreground">
                      <p className="font-semibold text-foreground mb-1">🎯 You're almost done!</p>
                      <p>Your response helps Bhargavi build AI tools that actually solve real CA problems. Thank you!</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-between mt-8 pt-4 border-t border-border">
                {step > 1 ? (
                  <button type="button" onClick={() => setStep((s) => s - 1)} className="px-6 py-2.5 rounded-xl border border-border text-foreground font-medium text-sm hover:bg-muted transition-all">← Back</button>
                ) : <div />}
                {step < totalSteps ? (
                  <button type="button" onClick={nextStep} className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm flex items-center gap-2 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all">
                    Next <ChevronRight size={16} />
                  </button>
                ) : (
                  <button type="submit" disabled={isSubmitting} className="px-8 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm flex items-center gap-2 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed">
                    {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : <>Submit Survey <ArrowRight size={16} /></>}
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Survey() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <section id="survey" className="py-24 bg-background relative overflow-hidden">
        <div className="absolute top-8 left-8 opacity-10 hidden lg:block">
          <CalculatorDoodle className="w-20 h-20 text-primary" />
        </div>
        <div className="absolute bottom-8 right-8 opacity-10 hidden lg:block">
          <ChartDoodle className="w-20 h-20 text-primary" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-navy rounded-[3rem] p-8 md:p-16 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-[100px] opacity-30 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/20 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute top-4 right-20 opacity-15 hidden md:block">
              <BrainAIDoodle className="w-16 h-16 text-primary" />
            </div>
            <div className="absolute bottom-4 left-12 opacity-10 hidden md:block">
              <CalculatorDoodle className="w-12 h-12 text-white" />
            </div>

            <div className="relative z-10 text-center">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6">
                  <ClipboardList className="w-4 h-4 text-primary" />
                  <span className="text-white/80 text-sm font-medium">2 minutes · 3 steps · Your voice matters</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6 leading-tight">
                  Shape the Future of <br />
                  <span className="text-gradient">AI in Chartered Accountancy</span>
                </h2>
                <p className="text-white/70 text-lg max-w-xl mx-auto mb-10">
                  Bhargavi is building FinAI CA based on <strong className="text-white">real needs from real people</strong>. Take 2 minutes to tell us what you actually need — and we'll build it for you.
                </p>
                <div className="flex flex-wrap justify-center gap-6 mb-10 text-white/60 text-sm">
                  {["100% Anonymous", "No spam ever", "Directly shapes our roadmap"].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                      {item}
                    </div>
                  ))}
                </div>
                <motion.button onClick={() => setOpen(true)} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-primary text-primary-foreground font-bold text-xl shadow-[0_0_50px_rgba(212,175,55,0.4)] hover:shadow-[0_0_70px_rgba(212,175,55,0.6)] transition-all duration-300">
                  <ClipboardList size={22} />
                  Take a Small Survey
                  <ArrowRight size={22} />
                </motion.button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {open && <SurveyModal onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
