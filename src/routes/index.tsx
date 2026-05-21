import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Toaster, toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck, MapPin, DollarSign,
  CheckCircle2, Send, Camera, ArrowRight, Weight, Clock, ThumbsUp
} from "lucide-react";
import heroUte from "@/assets/hero-ute.webp";
import servicesHero from "@/assets/services-hero.webp";
import howItWorksHero from "@/assets/how-it-works-hero.webp";
import faqHero from "@/assets/faq-hero.webp";

const PHONE = "0415 125 702";
const TEL = "tel:0415125702";
const WHATSAPP_NUMBER = "61415125702";
const QUOTE_MSG =
  "Hi HaulMate WA! I'd like a quote for rubbish removal in Perth.\n\n• Suburb: \n• What needs removing: \n• Preferred day/time: \n\n(Happy to send a photo too)";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(QUOTE_MSG)}`;

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "HaulMate WA | Rubbish Removal Perth — Fast & Reliable" },
      {
        name: "description",
        content:
          "Quick, hassle-free rubbish removal for Perth homes and businesses. Couches, garden clippings, shed junk—we load it and clear it for you. Call 0415 125 702 for a free quote.",
      },
      { name: "keywords", content: "rubbish removal Perth, furniture removal Perth, garden waste removal Perth, garage cleanouts Perth, junk removal Perth, spacious tray UTE rubbish removal, fast local rubbish removal" },
      { property: "og:title", content: "HaulMate WA | Rubbish Removal Perth" },
      { property: "og:description", content: "Fast, reliable rubbish removal across Perth. Call 0415 125 702 for a free quote." },
      { property: "og:type", content: "website" },
    ],
  }),
});

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  phone: z.string().trim().min(8, "Enter a valid phone number").max(20),
  suburb: z.string().trim().min(2, "Enter your suburb").max(80),
  details: z.string().trim().min(5, "Tell us what needs removing").max(800),
});
type FormVals = z.infer<typeof schema>;

function Index() {
  const [submitted, setSubmitted] = useState(false);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const {
    register, handleSubmit, formState: { errors, isSubmitting }, reset,
  } = useForm<FormVals>({ resolver: zodResolver(schema) });

  const carouselImages = [
    { src: heroUte, alt: "Spacious tray UTE loaded with furniture and household rubbish in Perth" },
    { src: servicesHero, alt: "HaulMate WA rubbish removal service in action" },
    { src: howItWorksHero, alt: "Reliable rubbish disposal crew" },
    { src: faqHero, alt: "Shed and garage cleanup service" }
  ];
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const onSubmit = async (_v: FormVals) => {
    await new Promise((r) => setTimeout(r, 600));
    setSubmitted(true);
    toast.success("Quote request sent! We'll be in touch shortly.");
    reset();
    setPhotoName(null);
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "HaulMate WA",
    description: "Quick, hassle-free rubbish removal for Perth homes and businesses.",
    telephone: "+61415125702",
    areaServed: "Perth, Western Australia",
    priceRange: "$$",
    address: { "@type": "PostalAddress", addressLocality: "Perth", addressRegion: "WA", addressCountry: "AU" },
  };

  return (
    <div className="bg-background text-foreground overflow-x-hidden">
      <Toaster position="top-center" richColors />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* HERO */}
      <section id="top" className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white via-white to-yellow/20" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-12 pb-20 lg:pt-20 lg:pb-28 grid lg:grid-cols-12 gap-10 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-navy/5 text-navy px-3 py-1 text-xs font-semibold uppercase tracking-wider">
              <span className="h-2 w-2 rounded-full bg-yellow animate-pulse" /> Perth's local hauling crew
            </span>
            <h1 className="mt-5 font-display text-4xl sm:text-6xl lg:text-7xl leading-[0.95] text-navy">
              STUFF GONE.<br />
              <span className="text-yellow">SORTED.</span><br />
              <span className="brush text-navy">We'll take it!</span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-navy/70 max-w-xl leading-relaxed">
              Quick, hassle-free <strong>rubbish removal for Perth locals</strong>. From old couches to garden clippings and shed junk — we load it, clear it, and leave your space spotless.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/book" className="inline-flex items-center gap-2 rounded-full bg-yellow text-navy px-6 py-3.5 font-semibold shadow-lg shadow-yellow/20 hover:-translate-y-0.5 hover:shadow-xl transition-all">
                Book Now <ArrowRight className="h-5 w-5" />
              </Link>
              <Link to="/services" className="inline-flex items-center gap-2 rounded-full bg-white text-navy px-6 py-3.5 font-semibold border border-navy/10 hover:border-navy/30 transition-all">
                View Services
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {["Fast Service", "Fair Prices", "Licensed & Insured", "Spacious Tray UTE"].map((b, i) => (
                <motion.span 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  key={b} 
                  className="rounded-full bg-white border border-navy/10 px-3 py-1.5 text-xs font-semibold text-navy shadow-sm"
                >
                  ✓ {b}
                </motion.span>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-6 relative"
          >
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shadow-navy/20 ring-1 ring-navy/10 bg-slate-100">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentSlide}
                  src={carouselImages[currentSlide].src}
                  alt={carouselImages[currentSlide].alt}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-tr from-navy/30 via-transparent to-transparent pointer-events-none" />
              
              {/* Carousel Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                {carouselImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentSlide === idx ? "w-6 bg-yellow" : "w-2 bg-white/60 hover:bg-white"
                    }`}
                  />
                ))}
              </div>
            </div>
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="absolute -top-5 -right-3 sm:-right-6 h-32 w-32 sm:h-40 sm:w-40 rounded-full bg-yellow text-navy flex flex-col items-center justify-center text-center p-3 shadow-xl ring-4 ring-white z-10"
            >
              <Clock className="h-5 w-5 mb-1" />
              <div className="font-display text-sm sm:text-base leading-tight">SAME-DAY<br/>SERVICE</div>
              <div className="text-[10px] sm:text-xs font-bold mt-1">Book before 12 PM!</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="bg-navy text-white py-5 overflow-hidden">
        <div className="flex gap-12 whitespace-nowrap animate-marquee min-w-max">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex gap-12 items-center pr-12">
              {[
                { i: Clock, t: "Fast Service" },
                { i: ShieldCheck, t: "Licensed & Insured" },
                { i: DollarSign, t: "Fair Prices" },
                { i: MapPin, t: "Local Perth Business" },
                { i: Clock, t: "Same-Day Bookings" },
                { i: ThumbsUp, t: "No Fuss, Just Sorted" },
              ].map(({ i: I, t }) => (
                <span key={t + k} className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide">
                  <I className="h-4 w-4 text-yellow" /> {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* QUICK PREVIEW SECTION */}
      <section className="py-8 sm:py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
           <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
           >
             <h2 className="font-display text-2xl sm:text-4xl text-navy mb-5 sm:mb-8">Everything you need, sorted.</h2>
             <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                <Link to="/services" className="bg-white px-4 py-2.5 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 font-semibold text-sm sm:text-base text-navy hover:border-yellow hover:shadow-md transition-all">
                  Our Services
                </Link>
                <Link to="/how-it-works" className="bg-white px-4 py-2.5 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 font-semibold text-sm sm:text-base text-navy hover:border-yellow hover:shadow-md transition-all">
                  How it Works
                </Link>
                <Link to="/why-us" className="bg-white px-4 py-2.5 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 font-semibold text-sm sm:text-base text-navy hover:border-yellow hover:shadow-md transition-all">
                  Why Choose Us
                </Link>
             </div>
           </motion.div>
        </div>
      </section>

      {/* SERVICE AREA */}
      <section className="py-12 sm:py-16 lg:py-20 bg-yellow/15 overflow-hidden">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 flex flex-col lg:grid lg:grid-cols-2 gap-10 items-center justify-center text-center lg:text-left">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center lg:items-start w-full"
          >
            <p className="text-navy bg-white inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">Service area</p>
            <h2 className="mt-2 mb-4 responsive-heading text-navy font-display text-center lg:text-left w-full">
              Servicing Perth &<br className="sm:hidden" /> Surrounding Areas
            </h2>
            <p className="mt-2 responsive-paragraph text-navy/75 max-w-lg mx-auto lg:mx-0 text-center lg:text-left px-2 sm:px-0">
              Wherever you are in the Perth metro and nearby suburbs, we'll come to you. Friendly local crew, fair prices, and the same job-done attitude every time.
            </p>
            <div className="mt-6 flex flex-wrap justify-center lg:justify-start gap-2 w-full max-w-lg">
              {["Perth CBD", "Northern Suburbs", "Southern Suburbs", "Eastern Suburbs", "Western Suburbs", "Hills"].map((s) => (
                <span key={s} className="inline-flex items-center gap-1.5 rounded-full bg-white border border-navy/10 px-3 py-1.5 text-sm font-medium text-navy">
                  <MapPin className="h-3.5 w-3.5 text-yellow-foreground" /> {s}
                </span>
              ))}
            </div>
          </motion.div>
          <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8 }}
             className="relative w-full flex justify-center"
          >
            <div className="aspect-square w-full max-w-[280px] xs:max-w-[320px] sm:max-w-md mx-auto rounded-full bg-gradient-to-br from-navy to-navy/70 relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "radial-gradient(circle at 30% 40%, rgba(255,255,255,0.18) 0 2px, transparent 3px), radial-gradient(circle at 70% 60%, rgba(255,255,255,0.18) 0 2px, transparent 3px)", backgroundSize: "60px 60px" }} />
              <span className="absolute inset-0 m-auto h-20 w-20 rounded-full bg-yellow/40 animate-ping" />
              <span className="absolute inset-0 m-auto h-40 w-40 rounded-full border border-yellow/40 animate-pulse-slow" />
              <span className="absolute inset-0 m-auto h-64 w-64 rounded-full border border-yellow/20" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <MapPin className="h-12 w-12 text-yellow drop-shadow-lg" />
                <div className="mt-2 font-display text-2xl">Perth, WA</div>
                <div className="text-white/70 text-sm">We come to you</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* QUOTE CTA + FORM */}
      <section id="quote" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-3xl bg-navy text-white p-8 sm:p-12 lg:p-16 relative overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 h-64 w-64 rounded-full bg-yellow/20 blur-3xl" />
            <div className="grid lg:grid-cols-2 gap-12 relative">
              <div>
                <p className="text-yellow text-xs font-bold uppercase tracking-wider">Free quote</p>
                <h2 className="mt-3 font-display text-3xl sm:text-5xl">Need rubbish gone today?</h2>
                <p className="mt-4 text-white/80 max-w-md">Call or message for a free quote. Quick replies, fair pricing, and no fuss.</p>
                <a href={TEL} className="mt-8 block group">
                  <div className="text-xs uppercase tracking-wider text-yellow font-semibold">Call us now</div>
                  <div className="font-display text-4xl sm:text-6xl group-hover:text-yellow transition-colors">{PHONE}</div>
                </a>

              </div>

              <div className="rounded-2xl bg-white text-navy p-6 sm:p-8 shadow-2xl">
                {submitted ? (
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-10">
                    <div className="mx-auto h-16 w-16 rounded-full bg-yellow flex items-center justify-center">
                      <CheckCircle2 className="h-8 w-8 text-navy" />
                    </div>
                    <h3 className="mt-4 font-display text-2xl">Thanks — we've got it!</h3>
                    <p className="mt-2 text-navy/70">We'll be in touch shortly with your free quote.</p>
                    <button onClick={() => setSubmitted(false)} className="mt-6 inline-flex items-center gap-2 rounded-full bg-navy text-white px-5 py-2.5 font-semibold hover:bg-navy/90">
                      Send another request
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                    <h3 className="font-display text-2xl">Request a free quote</h3>
                    <Field label="Your name" error={errors.name?.message}>
                      <input {...register("name")} maxLength={80} className="input" placeholder="e.g. Jamie" />
                    </Field>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="Phone" error={errors.phone?.message}>
                        <input {...register("phone")} maxLength={20} inputMode="tel" className="input" placeholder="04xx xxx xxx" />
                      </Field>
                      <Field label="Suburb" error={errors.suburb?.message}>
                        <input {...register("suburb")} maxLength={80} className="input" placeholder="e.g. Joondalup" />
                      </Field>
                    </div>
                    <Field label="What needs removing?" error={errors.details?.message}>
                      <textarea {...register("details")} maxLength={800} rows={4} className="input resize-none" placeholder="e.g. Old couch, 2 mattresses, and some garden waste." />
                    </Field>
                    <Field label="Upload a photo (optional)">
                      <label className="flex items-center gap-3 rounded-xl border border-dashed border-navy/25 px-4 py-3 cursor-pointer hover:bg-yellow/10 transition-colors">
                        <Camera className="h-5 w-5 text-navy/60" />
                        <span className="text-sm text-navy/70 truncate">{photoName ?? "Tap to attach a photo of the job"}</span>
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => setPhotoName(e.target.files?.[0]?.name ?? null)} />
                      </label>
                    </Field>
                    <button type="submit" disabled={isSubmitting} className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-navy text-white py-3.5 font-semibold hover:bg-navy/90 disabled:opacity-70 transition-all">
                      {isSubmitting ? "Sending..." : (<>Request my free quote <Send className="h-4 w-4" /></>)}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* TRUST BADGES */}
      <section className="pb-10 sm:pb-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <div className="trust-cards-container">
            {[
              { i: ShieldCheck, t: "Licensed & Insured" },
              { i: MapPin, t: "Local Perth Business" },
              { i: ThumbsUp, t: "Reliable Service" },
              { i: DollarSign, t: "Fair Prices" },
              { i: Clock, t: "Same-Day Bookings" },
            ].map(({ i: I, t }, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                key={t} 
                className="trust-card rounded-2xl bg-white border border-slate-100 shadow-md shadow-slate-100/50 hover:shadow-lg p-5 flex flex-col items-center justify-center text-center gap-3 hover:border-yellow/50 hover:-translate-y-1 transition-all min-h-[140px]"
              >
                <span className="h-14 w-14 rounded-full bg-yellow text-navy flex items-center justify-center shadow-inner hover:scale-105 transition-transform duration-300">
                  <I className="h-7 w-7" />
                </span>
                <div className="font-display text-sm sm:text-base text-navy leading-snug">{t}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
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

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-navy mb-1.5">{label}</span>
      {children}
      {error && <span className="block mt-1 text-xs text-destructive font-medium">{error}</span>}
      <style>{`.input{width:100%;border-radius:0.75rem;border:1px solid oklch(0.92 0.01 255);background:white;padding:0.7rem 0.9rem;font-size:0.95rem;outline:none;transition:border-color .15s, box-shadow .15s}.input:focus{border-color:oklch(0.83 0.17 88);box-shadow:0 0 0 4px oklch(0.83 0.17 88 / 0.25)}`}</style>
    </label>
  );
}
