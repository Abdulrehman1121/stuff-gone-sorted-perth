import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { ArrowRight, HelpCircle } from "lucide-react";
import logoImage from "@/assets/HaulMate WA Reliable Transit Logo_page-0001.jpg";
import faqHero from "@/assets/faq_hero.png";

export const Route = createFileRoute("/faq")({
  component: Faq,
});

const FAQS = [
  {
    q: "What types of rubbish do you remove?",
    a: "We remove almost all types of household and commercial non-hazardous waste. This includes furniture, white goods, green waste, e-waste, and general junk. We cannot take hazardous materials like asbestos, wet paint, or chemicals.",
  },
  {
    q: "How much does it cost?",
    a: "Our pricing is fair and upfront, based on the volume of rubbish and the type of materials. For an exact quote, please fill out our booking form with a description and photo of your items.",
  },
  {
    q: "Do I need to be home for the collection?",
    a: "You do not need to be home as long as the rubbish is easily accessible (e.g., in the driveway or front yard) and we have confirmed the details and pricing beforehand.",
  },
  {
    q: "Are you licensed and insured?",
    a: "Yes! Stuff Gone Sorted is a fully licensed and insured Perth local business. Your property is safe in our hands.",
  },
  {
    q: "How big is your truck?",
    a: "We operate a one-tonne tray ute. It's perfect for navigating narrow Perth driveways and tight streets while still carrying a large volume of household rubbish.",
  },
];

function Faq() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="sticky top-0 z-40 backdrop-blur bg-white/85 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <img src={logoImage} alt="Stuff Gone Sorted Logo" className="h-10 w-10 rounded-full object-cover" />
            <span className="font-display text-lg text-navy">Stuff Gone Sorted</span>
          </Link>
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-navy/80">
            <Link to="/services" className="hover:text-navy">Services</Link>
            <Link to="/why-us" className="hover:text-navy">Why us</Link>
            <Link to="/how-it-works" className="hover:text-navy">How it works</Link>
            <Link to="/faq" className="font-bold text-navy">FAQ</Link>
          </nav>
          <Link to="/book" className="hidden sm:inline-flex items-center gap-2 rounded-full bg-navy text-white px-4 py-2 text-sm font-semibold hover:bg-navy/90 transition-colors shadow-sm">
            Book a Service
          </Link>
        </div>
      </header>

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
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-yellow/20 text-yellow mb-6">
                <HelpCircle className="h-6 w-6" />
              </div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-tight">
                Frequently Asked <span className="text-yellow">Questions</span>
              </h1>
              <p className="mt-6 text-lg text-white/80 max-w-xl">
                Got a question? We've got answers. If you can't find what you're looking for, feel free to give us a call.
              </p>
            </div>
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10"
            >
              <img src={faqHero} alt="Clean Garage" className="w-full h-full object-cover" />
            </motion.div>
          </motion.div>
        </section>

        <section className="py-20 bg-white">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Accordion type="single" collapsible className="w-full">
                {FAQS.map((faq, i) => (
                  <AccordionItem key={i} value={`item-${i}`} className="border-b border-navy/10 py-2">
                    <AccordionTrigger className="text-left font-semibold text-navy hover:text-navy/80 hover:no-underline">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-navy/70 leading-relaxed text-base pt-2 pb-4">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>

            <div className="mt-16 text-center">
              <h3 className="text-2xl font-display text-navy mb-4">Ready to clear your clutter?</h3>
              <Link to="/book" className="inline-flex items-center gap-2 rounded-full bg-yellow text-navy px-8 py-4 font-bold shadow-lg hover:-translate-y-0.5 transition-transform text-lg">
                Book a Service <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-navy text-white py-10 text-center">
        <p className="text-white/50 text-sm">© {new Date().getFullYear()} Stuff Gone Sorted. All rights reserved.</p>
      </footer>
    </div>
  );
}
