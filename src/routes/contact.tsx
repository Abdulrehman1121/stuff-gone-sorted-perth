import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Phone, MapPin, Mail, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

const PHONE = "0415 125 702";
const TEL = "tel:0415125702";
const WHATSAPP_NUMBER = "61415125702";
const QUOTE_MSG = "Hi HaulMate WA! I'd like a quote for rubbish removal in Perth.\n\n• Suburb: \n• What needs removing: \n• Preferred day/time: \n\n(Happy to send a photo too)";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(QUOTE_MSG)}`;

function ContactPage() {
  return (
    <div className="bg-background text-foreground flex flex-col">
      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-navy text-white pt-20 pb-24 text-center">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-navy via-navy to-[#1e3a8a] opacity-90" />
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-4xl px-4 sm:px-6 text-center"
          >
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl leading-tight">
              Get in <span className="text-yellow">Touch</span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-white/80 max-w-2xl mx-auto">
              Ready to clear the clutter? Call, message, or WhatsApp us today for a free, upfront quote. We're your local Perth rubbish removal experts.
            </p>
          </motion.div>
        </section>

        {/* CONTACT INFO GRID */}
        <section className="py-20 bg-gray-50 -mt-10 relative z-10">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid md:grid-cols-3 gap-8">
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow"
              >
                <div className="h-14 w-14 rounded-full bg-yellow/20 text-navy flex items-center justify-center mb-6">
                  <Phone className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-navy mb-2">Call Us</h3>
                <p className="text-navy/60 mb-4">Immediate assistance and quotes</p>
                <a href={TEL} className="text-2xl font-display text-navy hover:text-yellow transition-colors">{PHONE}</a>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow"
              >
                <div className="h-14 w-14 rounded-full bg-[#25D366]/20 text-[#25D366] flex items-center justify-center mb-6">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-navy mb-2">WhatsApp</h3>
                <p className="text-navy/60 mb-4">Send photos of your junk for a fast quote</p>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-block bg-[#25D366] text-white px-6 py-2.5 rounded-full font-semibold hover:-translate-y-0.5 transition-transform shadow-sm">
                  Message Us
                </a>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow"
              >
                <div className="h-14 w-14 rounded-full bg-navy/10 text-navy flex items-center justify-center mb-6">
                  <MapPin className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-navy mb-2">Service Area</h3>
                <p className="text-navy/60 mb-4">Where we operate</p>
                <p className="font-semibold text-navy">All of Perth Metro Area, WA</p>
              </motion.div>

            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
