import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Problems from "@/components/Problems";
import Services from "@/components/Services";
import Market from "@/components/Market";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import Waitlist from "@/components/Waitlist";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-background flex flex-col font-sans">
      <Navbar />
      <Hero />
      <Problems />
      <Services />
      <Market />
      
      {/* Process Section inline to save file count but keep flow */}
      <section className="py-24 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-3">How It Works</h2>
          <h3 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-16">
            Get Started in 3 Simple Steps
          </h3>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12 relative">
            <div className="hidden md:block absolute top-1/2 left-[20%] right-[20%] h-0.5 bg-border -z-10"></div>
            
            {[
              { step: "01", title: "Sign Up", desc: "Join our platform and complete your profile." },
              { step: "02", title: "Choose Service", desc: "Select the AI tools you need for your journey." },
              { step: "03", title: "Get Results", desc: "Let AI automate your workflow and prep." }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center bg-card p-6 w-full md:w-1/3">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground font-display font-bold text-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
                  {item.step}
                </div>
                <h4 className="text-xl font-bold text-foreground mb-2">{item.title}</h4>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <About />
      <Testimonials />
      <Waitlist />
      <Footer />
    </main>
  );
}
