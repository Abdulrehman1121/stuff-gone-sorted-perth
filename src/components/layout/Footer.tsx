import { Link } from "@tanstack/react-router";
import { Phone, MapPin, ShieldCheck, MessageSquare, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import logoImage from "@/assets/haulmate-wa-logo.webp";

const PHONE = "0415 125 702";
const TEL = "tel:0415125702";
const WHATSAPP_NUMBER = "61415125702";
const QUOTE_MSG = "Hi HaulMate WA! I'd like a quote for rubbish removal in Perth.\n\n• Suburb: \n• What needs removing: \n• Preferred day/time: \n\n(Happy to send a photo too)";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(QUOTE_MSG)}`;

export function Footer() {
  return (
    <>
      <footer className="bg-navy text-white pt-16 pb-28 md:pb-12 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Col */}
          <div>
            <div className="flex items-center gap-3">
              <img src={logoImage} alt="HaulMate WA Logo" className="h-14 w-14 rounded-full object-cover ring-2 ring-white/20" />
              <div className="font-display text-xl">HaulMate WA</div>
            </div>
            <p className="mt-4 text-white/70 text-sm leading-relaxed">
              Big or small, we haul it all. Fast, friendly, and reliable rubbish removal across Perth, Western Australia. Fully licensed and insured.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-yellow hover:text-navy transition-all">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-yellow hover:text-navy transition-all">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-yellow hover:text-navy transition-all">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-yellow hover:text-navy transition-all">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links Col */}
          <div className="text-sm">
            <div className="font-display text-lg mb-5 text-yellow">Quick Links</div>
            <ul className="space-y-3 text-white/70">
              <li><Link to="/" className="hover:text-yellow transition-colors inline-block">Home</Link></li>
              <li><Link to="/services" className="hover:text-yellow transition-colors inline-block">Our Services</Link></li>
              <li><Link to="/why-us" className="hover:text-yellow transition-colors inline-block">Why Choose Us</Link></li>
              <li><Link to="/how-it-works" className="hover:text-yellow transition-colors inline-block">How It Works</Link></li>
              <li><Link to="/faq" className="hover:text-yellow transition-colors inline-block">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-yellow transition-colors inline-block">Contact Us</Link></li>
            </ul>
          </div>

          {/* Legal Col */}
          <div className="text-sm">
            <div className="font-display text-lg mb-5 text-yellow">Legal & Support</div>
            <ul className="space-y-3 text-white/70">
              <li><Link to="/privacy-policy" className="hover:text-yellow transition-colors inline-block">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="hover:text-yellow transition-colors inline-block">Terms of Service</Link></li>
              <li><Link to="/book" className="hover:text-yellow transition-colors inline-block">Book Online</Link></li>
              <li><Link to="/admin" className="hover:text-yellow transition-colors inline-block">Admin Login</Link></li>
            </ul>
          </div>

          {/* Contact Col */}
          <div className="text-sm">
            <div className="font-display text-lg mb-5 text-yellow">Contact Us</div>
            <ul className="space-y-4">
              <li>
                <a href={TEL} className="flex items-center gap-3 text-white/80 hover:text-yellow group transition-colors">
                  <span className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-yellow/20"><Phone className="h-4 w-4" /></span>
                  {PHONE}
                </a>
              </li>
              <li>
                <div className="flex items-center gap-3 text-white/80">
                  <span className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center"><MapPin className="h-4 w-4" /></span>
                  Servicing Perth, WA
                </div>
              </li>
              <li>
                <div className="flex items-center gap-3 text-white/80">
                  <span className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center"><ShieldCheck className="h-4 w-4" /></span>
                  Licensed & Insured
                </div>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-16 mx-auto max-w-7xl px-4 sm:px-6 border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <div>© {new Date().getFullYear()} HaulMate WA. All rights reserved.</div>
          <div className="flex gap-4">
            <Link to="/privacy-policy" className="hover:text-white">Privacy</Link>
            <Link to="/terms-of-service" className="hover:text-white">Terms</Link>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp (desktop + mobile) */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Message us on WhatsApp"
        className="fixed bottom-24 right-4 md:bottom-6 md:right-6 z-50 inline-flex items-center gap-2 rounded-full bg-[#25D366] text-white pl-3 pr-4 py-3 shadow-2xl hover:-translate-y-0.5 transition-transform animate-pulse-slow"
      >
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
          <WhatsAppIcon className="h-5 w-5" />
        </span>
        <span className="hidden sm:inline font-semibold text-sm">WhatsApp Quote</span>
      </a>

      {/* Sticky mobile WhatsApp/Book bar */}
      <div className="md:hidden fixed bottom-4 inset-x-4 z-50 grid grid-cols-2 gap-2">
        <Link to="/book" className="inline-flex items-center justify-center gap-2 rounded-full bg-yellow text-navy py-3.5 font-display text-base shadow-2xl shadow-navy/30 active:scale-95 transition-transform">
          Book Now
        </Link>
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] text-white py-3.5 font-display text-base shadow-2xl shadow-green-900/30 active:scale-95 transition-transform">
          <WhatsAppIcon className="h-5 w-5" /> WhatsApp
        </a>
      </div>
    </>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M19.11 4.91A10.05 10.05 0 0 0 12.04 2C6.55 2 2.1 6.45 2.1 11.94c0 1.93.5 3.81 1.46 5.48L2 22l4.7-1.23a9.93 9.93 0 0 0 5.33 1.52h.01c5.49 0 9.94-4.45 9.94-9.94 0-2.65-1.03-5.15-2.87-7.44Zm-7.07 15.27h-.01a8.23 8.23 0 0 1-4.2-1.15l-.3-.18-2.79.73.74-2.72-.2-.31a8.21 8.21 0 0 1-1.27-4.41c0-4.56 3.71-8.27 8.28-8.27 2.21 0 4.29.86 5.85 2.43a8.2 8.2 0 0 1 2.42 5.85c0 4.56-3.71 8.03-8.27 8.03Zm4.54-6.18c-.25-.12-1.47-.72-1.69-.8-.23-.08-.39-.12-.56.12-.16.25-.64.8-.78.96-.14.16-.29.18-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.16 0-.43.06-.65.31-.22.25-.85.83-.85 2.03 0 1.2.87 2.36.99 2.52.12.16 1.71 2.61 4.14 3.66.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.18-.48-.3Z"/>
    </svg>
  );
}
