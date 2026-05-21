import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Truck, Recycle, CalendarClock, ShieldCheck } from "lucide-react";

import householdRubbishImage from "@/assets/household-rubbish-waste.webp";
import furnitureRemovalImage from "@/assets/furniture-removal-waste.webp";
import gardenGreenWasteImage from "@/assets/garden-green-waste.webp";
import garageShedCleanoutsImage from "@/assets/garage-shed-waste.webp";

export const Route = createFileRoute("/services")({
  component: Services,
  head: () => ({
    meta: [
      { title: "Our Services | Rubbish Removal Perth — HaulMate WA" },
      { name: "description", content: "Professional rubbish removal services in Perth. We handle household junk, furniture disposal, green garden waste, and garage cleanouts." },
    ],
  }),
});

const SERVICES = [
  {
    title: "Household Rubbish Removal",
    description: "Got old mattresses, broken appliances, or general clutter taking up space? Skip the hassle of hiring a bin—we’ll come to your property, do all the heavy lifting, and clear it out fast.",
    icon: Truck,
    image: householdRubbishImage,
    bullets: [
      "Mattresses & bed frames",
      "Whitegoods (fridges, washing machines)",
      "E-waste (old TVs, computers)",
      "General clutter & bags"
    ]
  },
  {
    title: "Furniture Removal",
    description: "Upgrading your home? We make getting rid of old couches, heavy dining tables, and bulky wardrobes incredibly easy. We handle the lifting so you can enjoy your new space without the stress.",
    icon: CalendarClock,
    image: furnitureRemovalImage,
    bullets: [
      "Sofas & lounges",
      "Dining tables & chairs",
      "Wardrobes & cabinets",
      "Office furniture & desks"
    ]
  },
  {
    title: "Garden & Green Waste",
    description: "Finished a big weekend in the garden? Let us haul away the loose branches, massive piles of clippings, and heavy soil. We ensure all green waste is disposed of responsibly and recycled wherever possible.",
    icon: Recycle,
    image: gardenGreenWasteImage,
    bullets: [
      "Branches & hedge trimmings",
      "Lawn clippings & weeds",
      "Wood & timber scraps",
      "Soil & organic garden waste"
    ]
  },
  {
    title: "Garage & Shed Cleanouts",
    description: "Ready to park your car in the garage again? We help you clear out years of accumulated clutter from sheds, garages, and storage units. Leave the sorting, lifting, and dirty work to us.",
    icon: CheckCircle2,
    image: garageShedCleanoutsImage,
    bullets: [
      "Old tools & equipment",
      "Storage boxes & bins",
      "Scrap metal & tires",
      "Decluttering shelves & workbenches"
    ]
  },
];

function Services() {
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
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 text-yellow px-3 py-1 text-xs font-semibold uppercase tracking-wider mb-4">
              ✓ What we haul
            </span>
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl leading-tight">
              Professional <span className="text-yellow">Rubbish Removal</span> Services in Perth
            </h1>
            <p className="mt-6 text-base sm:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              We handle all the heavy lifting so you don't have to. Fast, straightforward, and professional rubbish removal for homes and businesses across the Perth metro.
            </p>
            <div className="mt-8">
              <Link to="/book" className="inline-flex items-center gap-2 rounded-full bg-yellow text-navy px-6 py-3.5 font-semibold shadow-lg hover:-translate-y-0.5 transition-transform">
                Book a Pickup <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </motion.div>
        </section>

        {/* ALTERNATING SERVICES SECTIONS */}
        <section className="py-24 space-y-32">
          {SERVICES.map((s, i) => {
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
                    <h2 className="font-display text-2xl sm:text-4xl text-navy mb-4 flex items-center gap-3.5">
                      <div className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-yellow/25 text-navy">
                        <s.icon className="h-6 w-6" />
                      </div>
                      <span>{s.title}</span>
                    </h2>
                    <p className="text-navy/70 text-base sm:text-lg leading-relaxed mb-6">
                      {s.description}
                    </p>
                    <ul className="grid sm:grid-cols-2 gap-3">
                      {s.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2.5 text-navy/80 text-sm font-medium">
                          <CheckCircle2 className="h-5 w-5 text-yellow flex-shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
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

        {/* Bottom trust banner */}
        <section className="bg-slate-50 py-16 border-t border-slate-100 text-center">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <h3 className="font-display text-2xl text-navy mb-4">
              Need junk removed that isn't listed here?
            </h3>
            <p className="text-navy/70 mb-8 max-w-xl mx-auto">
              Don't worry — we take almost anything that fits in our UTE. Give us a call or send a photo on WhatsApp for a custom quote.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/book" className="bg-yellow text-navy px-8 py-3.5 rounded-full font-bold shadow-lg hover:-translate-y-0.5 transition-all">
                Book a Pickup
              </Link>
              <Link to="/contact" className="bg-white text-navy border border-navy/15 px-8 py-3.5 rounded-full font-bold hover:bg-slate-50 transition-all">
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
