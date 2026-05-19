import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Truck, Recycle, CalendarClock } from "lucide-react";
import logoImage from "@/assets/HaulMate WA Reliable Transit Logo_page-0001.jpg";
import servicesHero from "@/assets/services_hero.png";

export const Route = createFileRoute("/services")({
  component: Services,
});

const SERVICES = [
  {
    title: "Household Rubbish Removal",
    description: "From old mattresses to broken appliances, we clear out your household junk quickly and efficiently. No need to hire a skip bin.",
    icon: Truck,
  },
  {
    title: "Furniture Removal",
    description: "Upgrading your furniture? We'll take away the old couches, dining tables, and wardrobes so you have space for the new ones.",
    icon: CalendarClock,
  },
  {
    title: "Garden & Green Waste",
    description: "After a big weekend in the garden, let us haul away the branches, clippings, and soil. Fast, eco-friendly disposal.",
    icon: Recycle,
  },
  {
    title: "Garage & Shed Cleanouts",
    description: "Reclaim your space. We help you clear decades of accumulated clutter from your shed, garage, or storage unit.",
    icon: CheckCircle2,
  },
];

function Services() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* NAV (Simplified for inner pages) */}
      <header className="sticky top-0 z-40 backdrop-blur bg-white/85 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <img src={logoImage} alt="Stuff Gone Sorted Logo" className="h-10 w-10 rounded-full object-cover" />
            <span className="font-display text-lg text-navy">Stuff Gone Sorted</span>
          </Link>
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-navy/80">
            <Link to="/" className="hover:text-navy">Home</Link>
            <Link to="/why-us" className="hover:text-navy">Why us</Link>
            <Link to="/how-it-works" className="hover:text-navy">How it works</Link>
            <Link to="/faq" className="hover:text-navy">FAQ</Link>
          </nav>
          <Link to="/book" className="hidden sm:inline-flex items-center gap-2 rounded-full bg-navy text-white px-4 py-2 text-sm font-semibold hover:bg-navy/90 transition-colors shadow-sm">
            Book a Service
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-navy text-white pt-20 pb-28">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-navy via-navy to-[#1e3a8a] opacity-90" />
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center"
          >
            <div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-tight">
                Professional <span className="text-yellow">Rubbish Removal</span> Services in Perth
              </h1>
              <p className="mt-6 text-lg text-white/80 max-w-xl">
                We handle all the heavy lifting so you don't have to. Fast, affordable, and eco-friendly rubbish removal for homes and businesses across Perth.
              </p>
              <div className="mt-8 flex gap-4">
                <Link to="/book" className="inline-flex items-center gap-2 rounded-full bg-yellow text-navy px-6 py-3.5 font-semibold shadow-lg hover:-translate-y-0.5 transition-transform">
                  Book Now <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10"
            >
              <img src={servicesHero} alt="Our Rubbish Removal Ute" className="w-full h-full object-cover" />
            </motion.div>
          </motion.div>
        </section>

        {/* SERVICES GRID */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="font-display text-3xl sm:text-4xl text-navy">What We Take</h2>
              <p className="mt-4 text-navy/70 max-w-2xl mx-auto">Big or small, we haul it all. If it fits in our one-tonne tray ute, we can take it away.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {SERVICES.map((s, i) => (
                <motion.div 
                  key={s.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-white rounded-2xl p-8 shadow-sm border border-navy/5 hover:shadow-md transition-shadow"
                >
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-yellow/20 text-navy mb-6">
                    <s.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-navy mb-3">{s.title}</h3>
                  <p className="text-navy/70 leading-relaxed">{s.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-navy text-white py-10 text-center">
        <p className="text-white/50 text-sm">© {new Date().getFullYear()} Stuff Gone Sorted. All rights reserved.</p>
      </footer>
    </div>
  );
}
