import { Link, useLocation } from "@tanstack/react-router";
import logoImage from "@/assets/HaulMate WA Reliable Transit Logo_page-0001.jpg";

export function Navbar() {
  const location = useLocation();

  const getLinkClass = (path: string) => {
    const isActive = location.pathname === path;
    return isActive
      ? "font-bold text-navy"
      : "hover:text-navy transition-colors";
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white/85 border-b border-border shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <img
            src={logoImage}
            alt="HaulMate WA Logo"
            className="h-10 w-10 rounded-full object-cover"
          />
          <span className="font-display text-lg text-navy">
            HaulMate WA
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-navy/80">
          <Link to="/" className={getLinkClass("/")}>
            Home
          </Link>
          <Link to="/services" className={getLinkClass("/services")}>
            Services
          </Link>
          <Link to="/why-us" className={getLinkClass("/why-us")}>
            Why us
          </Link>
          <Link to="/how-it-works" className={getLinkClass("/how-it-works")}>
            How it works
          </Link>
          <Link to="/faq" className={getLinkClass("/faq")}>
            FAQ
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link
            to="/contact"
            className="hidden lg:inline-flex text-sm font-medium text-navy/80 hover:text-navy"
          >
            Contact
          </Link>
          <Link
            to="/book"
            className="inline-flex items-center gap-2 rounded-full bg-navy text-white px-4 py-2 text-sm font-semibold hover:bg-navy/90 transition-colors shadow-sm"
          >
            Book a Service
          </Link>
        </div>
      </div>
    </header>
  );
}
