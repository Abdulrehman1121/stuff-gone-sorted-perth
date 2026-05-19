import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ClipboardList, CalendarCheck, Truck, ArrowRight } from "lucide-react";
import howItWorksHero from "@/assets/how_it_works_hero.png";

export const Route = createFileRoute("/how-it-works")({
  component: HowItWorks,
});

const STEPS = [
  {
    title: "1. Request a Booking",
    description: "Fill out our simple online form with details of what you need removed. Upload a photo if you can, and choose your preferred date and time.",
    icon: ClipboardList,
  },
  {
    title: "2. We Approve & Confirm",
    description: "Our admin team reviews your request and approves the booking. You will instantly receive a confirmation email with all the details.",
    icon: CalendarCheck,
  },
  {
    title: "3. We Haul It Away",
    description: "Our friendly team arrives on time, loads up your rubbish into our one-tonne tray ute, and hauls it away. Job done!",
    icon: Truck,
  },
];

function HowItWorks() {
  return (
    <div className="bg-background text-foreground flex flex-col">
      <main className="flex-1">
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
                How It <span className="text-yellow">Works</span>
              </h1>
              <p className="mt-6 text-lg text-white/80 max-w-xl">
                We've made rubbish removal as simple as possible. Just three easy steps and your clutter is gone forever.
              </p>
              <div className="mt-8">
                <Link to="/book" className="inline-flex items-center gap-2 rounded-full bg-yellow text-navy px-6 py-3.5 font-semibold shadow-lg hover:-translate-y-0.5 transition-transform">
                  Start Step 1 Now <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10"
            >
              <img src={howItWorksHero} alt="Customer Handshake" className="w-full h-full object-cover" />
            </motion.div>
          </motion.div>
        </section>

        <section className="py-24 bg-gray-50">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="space-y-12">
              {STEPS.map((s, i) => (
                <motion.div 
                  key={s.title}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  className="flex flex-col md:flex-row items-center gap-8 bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
                >
                  <div className="flex-shrink-0">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-yellow/20 text-navy">
                      <s.icon className="h-10 w-10" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-navy mb-4">{s.title}</h3>
                    <p className="text-navy/70 text-lg leading-relaxed">{s.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
