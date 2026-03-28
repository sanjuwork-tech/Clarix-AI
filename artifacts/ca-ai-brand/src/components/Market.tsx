import { motion } from "framer-motion";

export default function Market() {
  const stats = [
    { value: "3.5L+", label: "CA Students Enrolled", desc: "A massive ecosystem needing better educational tools." },
    { value: "₹2.5T", label: "Tax Compliance Market", desc: "A booming industry ripe for AI automation." },
    { value: "85%+", label: "Exam Failure Rate", desc: "Creating an urgent demand for personalized AI tutoring." },
    { value: "23%", label: "Fintech AI CAGR", desc: "Rapid adoption of AI in Indian finance and accounting." }
  ];

  return (
    <section id="market" className="py-24 bg-secondary text-white relative">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-3">Market Opportunity</h2>
          <h3 className="text-3xl md:text-5xl font-display font-bold">
            Why Now? The Industry is <br/> Ready for Disruption.
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center p-6"
            >
              <div className="text-5xl font-display font-extrabold text-primary mb-4 drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                {stat.value}
              </div>
              <h4 className="text-xl font-bold mb-2">{stat.label}</h4>
              <p className="text-white/70 text-sm leading-relaxed">{stat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
