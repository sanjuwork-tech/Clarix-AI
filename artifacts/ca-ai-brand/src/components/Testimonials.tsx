import { motion } from "framer-motion";
import { Star } from "lucide-react";

export default function Testimonials() {
  const reviews = [
    {
      quote: "The AI Exam Tutor completely changed my prep strategy. I was struggling with Audit, but the personalized mock tests helped me clear CA Inter.",
      author: "Rahul S.",
      role: "CA Final Student"
    },
    {
      quote: "We integrated the Compliance Tracker and Tax Assistant in our firm. It saved us roughly 40 billable hours per week during tax season.",
      author: "Priya M.",
      role: "Practicing CA, Partner"
    },
    {
      quote: "Finally, a tool built specifically for the Indian CA context. The accuracy of the GST automated filing is genuinely impressive.",
      author: "Vikram T.",
      role: "Finance Director"
    }
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground">
            Trusted by the Community
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card p-8 rounded-3xl border border-border shadow-lg shadow-black/5 flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-1 text-primary mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} fill="currentColor" />
                  ))}
                </div>
                <p className="text-lg text-foreground font-medium mb-8 leading-relaxed">
                  "{review.quote}"
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-xl">
                  {review.author[0]}
                </div>
                <div>
                  <h4 className="font-bold text-foreground">{review.author}</h4>
                  <p className="text-sm text-muted-foreground">{review.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
