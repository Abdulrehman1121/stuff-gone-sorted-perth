import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ShieldCheck, Clock, ThumbsUp, ArrowRight, DollarSign } from "lucide-react";

export const Route = createFileRoute("/why-us")({
  component: WhyUs,
  head: () => ({
    meta: [
      { title: "Why Choose Us | Rubbish Removal Perth — HaulMate WA" },
      { name: "description", content: "Discover why HaulMate WA is Perth's preferred rubbish removal provider. Fast service, transparent rates, fully insured, and eco-friendly waste management." },
    ],
  }),
});

const REASONS = [
  {
    title: "Fast & Reliable",
    description: "We show up when we say we will. We understand your time is valuable, so we offer prompt, dependable service across Perth Metro.",
    icon: Clock,
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Fair, Upfront Prices",
    description: "No hidden fees or surprise surcharges. We provide clear, itemized quotes based on the volume and type of rubbish, ensuring transparency.",
    icon: DollarSign,
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Licensed & Insured",
    description: "Peace of mind is guaranteed. We are fully insured and handle all waste responsibly in accordance with local regulations.",
    icon: ShieldCheck,
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Eco-Friendly Disposal",
    description: "We care about the planet. We sort, reuse, and recycle your items wherever possible to minimize landfill impact in Western Australia.",
    icon: ThumbsUp,
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80",
  },
];

function WhyUs() {
  return (
    <div className="bg-background text-foreground flex flex-col min-h-screen">
      <main className="flex-1">
        {/* HERO */}
        <section className="relative overflow-hidden bg-navy text-white pt-20 pb-24 text-center">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-navy via-navy to-[#1e3a8a] opacity-90" />
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-3xl px-4 sm:px-6"
          >
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-tight">
              Why Choose <span className="text-yellow">HaulMate WA?</span>
            </h1>
            <p className="mt-6 text-lg text-white/80 max-w-2xl mx-auto">
              We are a local Perth business dedicated to providing hassle-free, professional, and friendly rubbish removal services. We treat your property with respect.
            </p>
            <div className="mt-8">
              <Link to="/book" className="inline-flex items-center gap-2 rounded-full bg-yellow text-navy px-6 py-3.5 font-semibold shadow-lg hover:-translate-y-0.5 transition-transform">
                Book Now <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </motion.div>
        </section>

        {/* ALTERNATING REASONS SECTIONS */}
        <section className="py-24 space-y-32 bg-white">
          {REASONS.map((r, i) => {
            const isEven = i % 2 === 0;
            return (
              <div key={r.title} className="mx-auto max-w-7xl px-4 sm:px-6">
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
                        <r.icon className="h-6 w-6" />
                      </div>
                      <span>{r.title}</span>
                    </h2>
                    <p className="text-navy/70 text-lg leading-relaxed mb-6">
                      {r.description}
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
                        src={r.image} 
                        alt={r.title} 
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
      </main>
    </div>
  );
}
