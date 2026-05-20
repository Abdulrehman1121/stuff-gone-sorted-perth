import { Link, useLocation } from "@tanstack/react-router";
import logoImage from "@/assets/haulmate-wa-logo.webp";
import { useState, useEffect } from "react";
import { Menu, X, Phone, MessageSquare, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PHONE = "0415 125 702";
const TEL = "tel:0415125702";

export function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const getLinkClass = (path: string) => {
    const isActive = location.pathname === path;
    return isActive
      ? "font-bold text-navy"
      : "text-navy/80 hover:text-navy transition-colors";
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/services", label: "Services" },
    { to: "/why-us", label: "Why us" },
    { to: "/how-it-works", label: "How it works" },
    { to: "/faq", label: "FAQ" },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white/85 border-b border-border shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo and Brand */}
        <Link to="/" className="flex items-center gap-2 group">
          <img
            src={logoImage}
            alt="HaulMate WA Logo"
            className="h-10 w-10 rounded-full object-cover ring-2 ring-navy/5"
          />
          <span className="font-display text-lg text-navy font-bold">
            HaulMate WA
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} className={getLinkClass(link.to)}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Header Right Actions */}
        <div className="flex items-center gap-4">
          <Link
            to="/contact"
            className="hidden lg:inline-flex text-sm font-medium text-navy/80 hover:text-navy transition-colors"
          >
            Contact
          </Link>
          
          <Link
            to="/book"
            className="hidden sm:inline-flex items-center gap-2 rounded-full bg-navy text-white px-5 py-2 text-sm font-semibold hover:bg-navy/90 transition-all shadow-sm active:scale-95"
          >
            <Calendar className="h-4 w-4 text-yellow" />
            Book a Service
          </Link>

          {/* Hamburger Menu Toggle Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl text-navy bg-navy/5 hover:bg-navy/10 active:scale-95 transition-all"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation (using AnimatePresence) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 top-16 z-40 bg-navy/40 backdrop-blur-sm md:hidden"
            />

            {/* Menu Slide-in panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-16 right-0 bottom-0 z-40 w-full max-w-[290px] bg-white border-l border-border shadow-2xl p-6 flex flex-col justify-between md:hidden"
            >
              <div className="space-y-8">
                {/* Navigation Links List */}
                <nav className="flex flex-col gap-5 pt-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`text-lg font-semibold py-1 border-b border-navy/5 ${getLinkClass(
                        link.to
                      )}`}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Link
                    to="/contact"
                    className={`text-lg font-semibold py-1 border-b border-navy/5 ${getLinkClass(
                      "/contact"
                    )}`}
                  >
                    Contact
                  </Link>
                </nav>

                {/* Primary Booking Call-To-Action */}
                <div className="space-y-3 pt-2">
                  <Link
                    to="/book"
                    className="w-full inline-flex items-center justify-center gap-2.5 rounded-2xl bg-yellow text-navy py-4 font-display font-bold shadow-lg shadow-yellow/10 hover:bg-yellow/90 active:scale-[0.98] transition-all"
                  >
                    <Calendar className="h-5 w-5" />
                    Book online now
                  </Link>
                </div>
              </div>

              {/* Bottom Quick Contact Section */}
              <div className="border-t border-border pt-6 space-y-4">
                <div className="text-xs uppercase tracking-wider text-navy/40 font-bold">
                  Quick Contact
                </div>
                <div className="space-y-2">
                  <a
                    href={TEL}
                    className="flex items-center gap-3 text-navy font-semibold hover:text-yellow transition-colors group"
                  >
                    <span className="h-10 w-10 rounded-xl bg-navy/5 flex items-center justify-center group-hover:bg-yellow/20">
                      <Phone className="h-5 w-5 text-navy" />
                    </span>
                    <span className="text-sm">{PHONE}</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
