import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  role: z.string().min(1, "Please select a role"),
  message: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function Waitlist() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    
    toast({
      title: "You're on the list!",
      description: "Thanks for joining. We'll be in touch soon.",
    });
    reset();
  };

  return (
    <section id="waitlist" className="py-24 bg-background relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-navy rounded-[3rem] p-8 md:p-16 shadow-2xl relative overflow-hidden">
          {/* Decor */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-[100px] opacity-30 pointer-events-none" />
          
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
                Be the First to Experience FinAI CA.
              </h2>
              <p className="text-white/80 text-lg mb-8">
                Join our exclusive waitlist to get early access to our AI-powered tools for students and professionals.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-white/90">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-secondary text-xs font-bold">✓</div>
                  Early beta access
                </div>
                <div className="flex items-center gap-3 text-white/90">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-secondary text-xs font-bold">✓</div>
                  Exclusive pricing forever
                </div>
                <div className="flex items-center gap-3 text-white/90">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-secondary text-xs font-bold">✓</div>
                  Direct input on feature roadmap
                </div>
              </div>
            </div>

            <div className="bg-card p-8 rounded-2xl shadow-xl">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
                  <input
                    {...register("name")}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                  {errors.name && <p className="text-destructive text-xs mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Email Address</label>
                  <input
                    {...register("email")}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                  {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">I am a...</label>
                  <select
                    {...register("role")}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  >
                    <option value="">Select your role</option>
                    <option value="student">CA Student (Foundation/Inter/Final)</option>
                    <option value="professional">Practicing CA Professional</option>
                    <option value="business">Business Owner / Corporate</option>
                  </select>
                  {errors.role && <p className="text-destructive text-xs mt-1">{errors.role.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Joining...
                    </>
                  ) : (
                    "Join the Waitlist"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
