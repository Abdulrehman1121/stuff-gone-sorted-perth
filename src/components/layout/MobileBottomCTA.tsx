import { Link } from "@tanstack/react-router";
import { Phone, Calendar } from "lucide-react";

const TEL = "tel:0415125702";

export function MobileBottomCTA() {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-white/90 backdrop-blur-md border-t border-border shadow-[0_-8px_30px_rgb(0,0,0,0.06)] md:hidden">
      <div className="flex items-center justify-around p-3 gap-3 max-w-md mx-auto">
        {/* Call Button */}
        <a
          href={TEL}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-1.5 px-2 rounded-xl text-navy bg-navy/5 active:bg-navy/10 active:scale-95 transition-all text-center"
        >
          <Phone className="h-5 w-5 text-navy" />
          <span className="text-[10px] font-bold tracking-tight uppercase">Call</span>
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
