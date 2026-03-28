import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Problems from "@/components/Problems";
import Services from "@/components/Services";
import Market from "@/components/Market";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import Survey from "@/components/Survey";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { CalculatorDoodle, GearDoodle, DocumentDoodle } from "@/components/CaDoodles";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-background flex flex-col font-sans">
      <Navbar />
      <Hero />
      <Problems />
      <Services />
      <Market />

      {/* How It Works */}
      <section className="py-24 bg-card border-y border-border relative overflow-hidden">
        {/* Doodle decorations */}
        <div className="absolute top-6 right-6 opacity-10 hidden lg:block">
          <GearDoodle className="w-16 h-16 text-primary" />
        </div>
        <div className="absolute bottom-6 left-8 opacity-10 hidden lg:block">
          <DocumentDoodle className="w-14 h-14 text-primary" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5">
          <CalculatorDoodle className="w-40 h-40 text-primary" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-3">How It Works</h2>
            <h3 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-16">
              Get Started in 3 Simple Steps
            </h3>
          </motion.div>

          <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12 relative">
            <div className="hidden md:block absolute top-1/2 left-[20%] right-[20%] h-0.5 bg-border -z-10" />

            {[
              { step: "01", title: "Sign Up", desc: "Join our platform and complete your profile in under 2 minutes." },
              { step: "02", title: "Choose Service", desc: "Select the AI tools that match your CA journey or business needs." },
              { step: "03", title: "Get Results", desc: "Let AI automate your workflow, prep, and compliance — effortlessly." },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="flex flex-col items-center bg-card p-6 w-full md:w-1/3"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-16 h-16 rounded-full bg-primary text-primary-foreground font-display font-bold text-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary/20"
                >
                  {item.step}
                </motion.div>
                <h4 className="text-xl font-bold text-foreground mb-2">{item.title}</h4>
                <p className="text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <About />
      <Testimonials />
      <Survey />
      <Footer />
    </main>
  );
}
