import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ClipboardList, CalendarCheck, Truck, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/how-it-works")({
  component: HowItWorks,
  head: () => ({
    meta: [
      { title: "How It Works | Rubbish Removal Perth — HaulMate WA" },
      { name: "description", content: "Learn how simple rubbish removal is with HaulMate WA. Request a booking, get quick approval, and have your junk hauled away." },
    ],
  }),
});

const STEPS = [
  {
    title: "1. Request a Booking",
    description: "Fill out our simple online form with details of what you need removed. Upload a photo if you can, and choose your preferred date and time.",
    icon: ClipboardList,
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "2. We Approve & Confirm",
    description: "Our admin team reviews your request and approves the booking. You will instantly receive a confirmation email with all the details.",
    icon: CalendarCheck,
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "3. We Haul It Away",
    description: "Our friendly team arrives on time, loads up your rubbish into our one-tonne tray ute, and hauls it away. Job done!",
    icon: Truck,
    image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80",
  },
];

function HowItWorks() {
  return (
    <div className="bg-background text-foreground flex flex-col min-h-screen">
      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-navy text-white pt-20 pb-24 text-center">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-navy via-navy to-[#1e3a8a] opacity-90" />
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-3xl px-4 sm:px-6"
          >
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-tight">
              How It <span className="text-yellow">Works</span>
            </h1>
            <p className="mt-6 text-lg text-white/80 max-w-2xl mx-auto">
              We've made rubbish removal as simple as possible. Just three easy steps and your clutter is gone forever.
            </p>
            <div className="mt-8">
              <Link to="/book" className="inline-flex items-center gap-2 rounded-full bg-yellow text-navy px-6 py-3.5 font-semibold shadow-lg hover:-translate-y-0.5 transition-transform">
                Start Step 1 Now <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </motion.div>
        </section>

        {/* ALTERNATING STEPS SECTIONS */}
        <section className="py-24 space-y-32 bg-white">
          {STEPS.map((s, i) => {
            const isEven = i % 2 === 0;
            return (
              <div key={s.title} className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="grid lg:grid-cols-12 gap-12 items-center">
                  
                  {/* TEXT COLUMN */}
                  <motion.div 
                    initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7 }}
                    className={`lg:col-span-6 ${!isEven ? "lg:order-2" : ""}`}
                  >
                    <h2 className="font-display text-3xl sm:text-4xl text-navy mb-6 flex items-center gap-3.5">
                      <div className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-yellow/25 text-navy">
                        <s.icon className="h-6 w-6" />
                      </div>
                      <span>{s.title}</span>
                    </h2>
                    <p className="text-navy/70 text-lg leading-relaxed mb-6">
                      {s.description}
                    </p>
                  </motion.div>

                  {/* IMAGE COLUMN */}
                  <motion.div 
                    initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7 }}
                    className={`lg:col-span-6 ${!isEven ? "lg:order-1" : ""}`}
                  >
                    <div className="relative aspect-video sm:aspect-[4/3] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 group border border-slate-100">
                      <img 
                        src={s.image} 
                        alt={s.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy/30 to-transparent" />
                    </div>
                  </motion.div>

                </div>
              </div>
            );
          })}
        </section>

        {/* BOTTOM CALL TO ACTION */}
        <section className="bg-slate-50 py-16 border-t border-slate-100 text-center">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <h3 className="font-display text-2xl text-navy mb-4">
              Ready to get started?
            </h3>
            <p className="text-navy/70 mb-8 max-w-xl mx-auto">
              Fill out our simple form and clear your rubbish today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/book" className="bg-yellow text-navy px-8 py-3.5 rounded-full font-bold shadow-lg hover:-translate-y-0.5 transition-all">
                Book online now
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
