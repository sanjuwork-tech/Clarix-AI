import { motion } from "framer-motion";

export default function About() {
  return (
    <section id="about" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary translate-x-4 translate-y-4 rounded-3xl"></div>
              <img
                src={`${import.meta.env.BASE_URL}images/about-founder.png`}
                alt="Bhargavi - Founder of FinAI CA"
                className="relative z-10 w-full rounded-3xl object-cover shadow-2xl border-4 border-background aspect-square md:aspect-[4/3] lg:aspect-square"
              />
              <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-2xl shadow-xl z-20 border border-border">
                <p className="font-display font-bold text-xl text-foreground">Bhargavi</p>
                <p className="text-primary font-medium text-sm">Founder & CEO</p>
                <p className="text-muted-foreground text-xs mt-1">BCom Graduate, CA Aspirant</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2"
          >
            <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-3">Our Story</h2>
            <h3 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-6">
              Built by someone who has walked the path.
            </h3>
            <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
              <p>
                Hi, I'm Bhargavi. As a BCom graduate and CA professional, I've experienced the grueling CA journey firsthand. 
                The late nights, the endless syllabus, the stress of compliance deadlines—it's a path that demands everything.
              </p>
              <p>
                But I also realized something else: the tools we use are stuck in the past. While other industries were transformed by AI, the CA ecosystem was left behind.
              </p>
              <p>
                That's why I founded <strong>FinAI CA</strong>. Our mission is to democratize high-end financial and educational tools, using AI to empower students to pass their exams, and helping professionals automate the mundane so they can focus on what matters.
              </p>
            </div>
            
            <div className="mt-10">
              <img 
                src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=150&fit=crop" 
                alt="Signature placeholder" 
                className="h-16 opacity-40 mix-blend-multiply grayscale"
                // Using unsplash just for a generic abstract signature-like squiggle if needed, but we can skip it.
                // Actually, let's use a nice styled text instead of an image for the signature.
                style={{display: 'none'}}
              />
              <p className="font-display text-3xl font-medium text-foreground opacity-80 italic">
                Bhargavi.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
