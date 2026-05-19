import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { ArrowRight, HelpCircle } from "lucide-react";
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
    a: "Yes! HaulMate WA is a fully licensed and insured Perth local business. Your property is safe in our hands.",
  },
  {
    q: "How big is your truck?",
    a: "We operate a one-tonne tray ute. It's perfect for navigating narrow Perth driveways and tight streets while still carrying a large volume of household rubbish.",
  },
];

function Faq() {
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
    </div>
  );
}
