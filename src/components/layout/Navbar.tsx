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
  const [isScrolled, setIsScrolled] = useState(false);

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

  // Track scroll position for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const getLinkClass = (path: string) => {
    const isActive = location.pathname === path;
    return isActive
      ? "font-bold text-navy border-b-2 border-yellow md:border-none pb-1 md:pb-0"
      : "text-navy/80 hover:text-navy transition-colors pb-1 md:pb-0";
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/services", label: "Services" },
    { to: "/why-us", label: "Why Us" },
    { to: "/how-it-works", label: "How It Works" },
    { to: "/faq", label: "FAQ" },
  ];

  return (
    <>
      <header className={`sticky top-0 z-50 backdrop-blur transition-all duration-300 ${
        isScrolled 
          ? "bg-white/95 shadow-md border-b border-border/80" 
          : "bg-white/85 border-b border-border shadow-sm"
      }`}>
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
      </header>

      {/* Mobile Full-Screen Slide-Down Navigation (using AnimatePresence) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="fixed inset-x-0 top-16 bottom-0 z-[60] bg-white flex flex-col justify-between md:hidden border-t border-border/50"
          >
            <div className="overflow-y-auto px-6 py-8 flex flex-col justify-between h-full">
              <nav className="flex flex-col gap-6 pt-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`text-2xl font-bold py-2 transition-colors tracking-tight ${getLinkClass(
                      link.to
                    )}`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  to="/contact"
                  className={`text-2xl font-bold py-2 transition-colors tracking-tight ${getLinkClass(
                    "/contact"
                  )}`}
                >
                  Contact
                </Link>
              </nav>

              <div className="space-y-6 mt-8">
                {/* Primary Booking Call-To-Action */}
                <Link
                  to="/book"
                  className="w-full inline-flex items-center justify-center gap-3 rounded-2xl bg-yellow text-navy py-4 font-display font-bold shadow-lg shadow-yellow/20 hover:bg-yellow/90 active:scale-[0.98] transition-all text-lg"
                >
                  <Calendar className="h-5.5 w-5.5 text-navy" />
                  Book a Service
                </Link>

                {/* Bottom Quick Contact Section */}
                <div className="border-t border-border pt-6 pb-2 space-y-4">
                  <div className="text-xs uppercase tracking-wider text-navy/40 font-bold">
                    Quick Contact
                  </div>
                  <a
                    href={TEL}
                    className="flex items-center gap-3 text-navy font-semibold hover:text-yellow transition-colors group"
                  >
                    <span className="h-12 w-12 rounded-xl bg-navy/5 flex items-center justify-center group-hover:bg-yellow/20 transition-all">
                      <Phone className="h-5 w-5 text-navy" />
                    </span>
                    <div className="flex flex-col">
                      <span className="text-xs text-navy/50 font-medium">Call Us Directly</span>
                      <span className="text-base">{PHONE}</span>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
