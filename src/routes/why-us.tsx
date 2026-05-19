import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ShieldCheck, Clock, ThumbsUp, ArrowRight, DollarSign } from "lucide-react";

export const Route = createFileRoute("/why-us")({
  component: WhyUs,
});

const REASONS = [
  {
    title: "Fast & Reliable",
    description: "We show up when we say we will. We understand your time is valuable, so we offer prompt service across Perth.",
    icon: Clock,
  },
  {
    title: "Fair, Upfront Prices",
    description: "No hidden fees. We provide clear quotes based on the volume and type of rubbish, ensuring you know what to expect.",
    icon: DollarSign,
  },
  {
    title: "Licensed & Insured",
    description: "Peace of mind is guaranteed. We are fully insured and handle all waste in accordance with local regulations.",
    icon: ShieldCheck,
  },
  {
    title: "Eco-Friendly Disposal",
    description: "We don't just dump everything. We sort and recycle wherever possible to minimize landfill impact.",
    icon: ThumbsUp,
  },
];

function WhyUs() {
  return (
    <div className="bg-background text-foreground flex flex-col">
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

        {/* FEATURES GRID */}
        <section className="py-24 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {REASONS.map((r, i) => (
                <motion.div 
                  key={r.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex flex-col items-center text-center p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-md transition-all"
                >
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-navy text-yellow mb-6">
                    <r.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-semibold text-navy mb-3">{r.title}</h3>
                  <p className="text-navy/70 leading-relaxed text-sm">{r.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
