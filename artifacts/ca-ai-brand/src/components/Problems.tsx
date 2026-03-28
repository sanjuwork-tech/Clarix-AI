import { motion } from "framer-motion";
import { BookOpen, FileWarning, AlertTriangle, Clock } from "lucide-react";

export default function Problems() {
  const problems = [
    {
      icon: <BookOpen className="w-8 h-8 text-primary" />,
      title: "Endless Syllabus",
      desc: "CA students struggle with overwhelming study material, low pass rates, and lack of personalized guidance."
    },
    {
      icon: <FileWarning className="w-8 h-8 text-primary" />,
      title: "Complex Compliance",
      desc: "Constantly changing tax laws and GST regulations make accurate filing a massive headache for professionals."
    },
    {
      icon: <AlertTriangle className="w-8 h-8 text-primary" />,
      title: "Tedious Audits",
      desc: "Manual vouching, risk detection, and documentation consume thousands of billable hours."
    },
    {
      icon: <Clock className="w-8 h-8 text-primary" />,
      title: "Missed Deadlines",
      desc: "Tracking ICAI, MCA, GST, and Income Tax deadlines across hundreds of clients causes constant anxiety."
    }
  ];

  return (
    <section id="problem" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-3">The Challenge</h2>
          <h3 className="text-3xl md:text-5xl font-display font-bold text-foreground">
            The CA Journey is Too Complex to Handle Alone.
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {problems.map((problem, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-muted/50 rounded-2xl p-8 border border-border hover:border-primary/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                {problem.icon}
              </div>
              <h4 className="text-xl font-bold text-foreground mb-3">{problem.title}</h4>
              <p className="text-muted-foreground leading-relaxed">
                {problem.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
