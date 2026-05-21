import { Link } from "@tanstack/react-router";
import { Phone, Calendar } from "lucide-react";

const PHONE = "0415 125 702";
const TEL = "tel:0415125702";
const WHATSAPP_NUMBER = "61415125702";
const QUOTE_MSG = "Hi HaulMate WA! I'd like a quote for rubbish removal in Perth.\n\n• Suburb: \n• What needs removing: \n• Preferred day/time: \n\n(Happy to send a photo too)";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(QUOTE_MSG)}`;

export function MobileBottomCTA() {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-white/90 backdrop-blur-md border-t border-border shadow-[0_-8px_30px_rgb(0,0,0,0.06)] md:hidden">
      <div className="flex items-center justify-around p-3 gap-2 max-w-md mx-auto">
        {/* Call Button */}
        <a
          href={TEL}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-1.5 px-2 rounded-xl text-navy bg-navy/5 active:bg-navy/10 active:scale-95 transition-all text-center"
        >
          <Phone className="h-5 w-5 text-navy" />
          <span className="text-[10px] font-bold tracking-tight uppercase">Call</span>
        </a>

        {/* WhatsApp Button */}
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex flex-col items-center justify-center gap-1 py-1.5 px-2 rounded-xl text-white bg-[#25D366] hover:bg-[#22c35e] active:scale-95 transition-all text-center"
        >
          <WhatsAppIcon className="h-5 w-5" />
          <span className="text-[10px] font-bold tracking-tight uppercase">WhatsApp</span>
        </a>

        {/* Book Now Button */}
        <Link
          to="/book"
          className="flex-1 flex flex-col items-center justify-center gap-1 py-1.5 px-2 rounded-xl text-navy bg-yellow hover:bg-yellow/90 active:scale-95 transition-all text-center"
        >
          <Calendar className="h-5 w-5 text-navy" />
          <span className="text-[10px] font-bold tracking-tight uppercase">Book</span>
        </Link>
      </div>
    </div>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M19.11 4.91A10.05 10.05 0 0 0 12.04 2C6.55 2 2.1 6.45 2.1 11.94c0 1.93.5 3.81 1.46 5.48L2 22l4.7-1.23a9.93 9.93 0 0 0 5.33 1.52h.01c5.49 0 9.94-4.45 9.94-9.94 0-2.65-1.03-5.15-2.87-7.44Zm-7.07 15.27h-.01a8.23 8.23 0 0 1-4.2-1.15l-.3-.18-2.79.73.74-2.72-.2-.31a8.21 8.21 0 0 1-1.27-4.41c0-4.56 3.71-8.27 8.28-8.27 2.21 0 4.29.86 5.85 2.43a8.2 8.2 0 0 1 2.42 5.85c0 4.56-3.71 8.03-8.27 8.03Zm4.54-6.18c-.25-.12-1.47-.72-1.69-.8-.23-.08-.39-.12-.56.12-.16.25-.64.8-.78.96-.14.16-.29.18-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.16 0-.43.06-.65.31-.22.25-.85.83-.85 2.03 0 1.2.87 2.36.99 2.52.12.16 1.71 2.61 4.14 3.66.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.18-.48-.3Z"/>
    </svg>
  );
}
