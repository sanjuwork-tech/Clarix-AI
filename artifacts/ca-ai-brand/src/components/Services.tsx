import { motion } from "framer-motion";
import { GraduationCap, FileText, ClipboardCheck, Bell, TrendingUp, Users } from "lucide-react";

export default function Services() {
  const services = [
    {
      icon: <GraduationCap className="w-7 h-7" />,
      title: "CA Exam AI Tutor",
      desc: "Personalized study plans, dynamic MCQ practice, and predictive mock tests for CA Foundation, Inter & Final.",
      color: "bg-blue-500/10 text-blue-600 border-blue-200"
    },
    {
      icon: <FileText className="w-7 h-7" />,
      title: "Tax Filing Assistant",
      desc: "Automated ITR, GST returns, and TDS compliance using OCR and intelligent tax logic.",
      color: "bg-green-500/10 text-green-600 border-green-200"
    },
    {
      icon: <ClipboardCheck className="w-7 h-7" />,
      title: "Audit AI Assistant",
      desc: "AI-powered audit checklists, anomaly detection in ledgers, and automated documentation generation.",
      color: "bg-purple-500/10 text-purple-600 border-purple-200"
    },
    {
      icon: <Bell className="w-7 h-7" />,
      title: "Compliance Tracker",
      desc: "Real-time, client-specific alerts for all statutory deadlines across ICAI, MCA, and Tax portals.",
      color: "bg-orange-500/10 text-orange-600 border-orange-200"
    },
    {
      icon: <TrendingUp className="w-7 h-7" />,
      title: "Financial Advisory AI",
      desc: "Smart cash flow analysis, automated budgeting tools, and data-driven investment planning.",
      color: "bg-primary/10 text-primary border-primary/20"
    },
    {
      icon: <Users className="w-7 h-7" />,
      title: "CA Practice Management",
      desc: "End-to-end client onboarding, secure document storage, and automated billing for modern CA firms.",
      color: "bg-rose-500/10 text-rose-600 border-rose-200"
    }
  ];

  return (
    <section id="services" className="py-24 bg-muted/30 relative overflow-hidden">
      {/* Decorative element */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-3">Our Solutions</h2>
            <h3 className="text-3xl md:text-5xl font-display font-bold text-foreground">
              AI Services Built for the <br/> CA Ecosystem.
            </h3>
          </div>
          <a href="#waitlist" className="hidden md:inline-flex px-6 py-3 rounded-xl bg-secondary text-white font-semibold hover:bg-secondary/90 transition-colors">
            Get Early Access
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-card rounded-2xl p-8 border border-border shadow-sm hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 border ${service.color} group-hover:scale-110 transition-transform duration-300`}>
                {service.icon}
              </div>
              <h4 className="text-xl font-bold text-foreground mb-3">{service.title}</h4>
              <p className="text-muted-foreground leading-relaxed">
                {service.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
