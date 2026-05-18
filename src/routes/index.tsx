import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Toaster, toast } from "sonner";
import {
  Phone, MessageSquare, Sofa, Trash2, Leaf, Warehouse, Truck, Boxes,
  Building2, Recycle, Clock, ShieldCheck, ThumbsUp, MapPin, DollarSign,
  Zap, CheckCircle2, Star, Send, Camera, ArrowRight, Weight, HelpCircle,
} from "lucide-react";
import heroUte from "@/assets/hero-ute.jpg";
import { useReveal } from "@/hooks/use-reveal";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const FAQS: { q: string; a: string }[] = [
  {
    q: "How much does rubbish removal in Perth cost?",
    a: "Pricing is based on volume, weight and the type of rubbish — not a flat fee. Most small jobs (a couple of items, a single mattress, a few green waste bags) start from around $90. A half ute load is typically $180–$280 and a full one‑tonne load $350–$550. Send us a photo or quick description on 0415 125 702 for a free, upfront quote with no surprises.",
  },
  {
    q: "What items will you take away?",
    a: "Furniture, mattresses, lounges, whitegoods, general household junk, garden and green waste, e‑waste, office and shed clutter, building offcuts and renovation debris. If you're not sure, send a photo — chances are we'll take it.",
  },
  {
    q: "Are there items you can't remove?",
    a: "For safety and disposal rules we can't take asbestos, liquid chemicals, paint, fuels, gas bottles, car tyres, or hazardous medical waste. If you have something tricky, give us a call and we'll point you to the right service.",
  },
  {
    q: "How quickly can you come out?",
    a: "Most Perth jobs are sorted same‑day or next‑day. Call or message before noon and we can usually be there the same afternoon. Booked jobs get a tight arrival window — we don't waste your day.",
  },
  {
    q: "Which suburbs do you service?",
    a: "All of the Perth metro and surrounding areas — including the CBD, northern, southern, eastern and western suburbs, plus the Hills. If you're nearby and not sure, just ask.",
  },
  {
    q: "Do I need to be home when you arrive?",
    a: "Not always. If the rubbish is accessible (front yard, driveway, verge or side of the house), we're happy to pick it up while you're out. Send a photo and pay by bank transfer or card once it's done.",
  },
  {
    q: "Do you do the lifting and loading?",
    a: "Yes — all of it. We load, sweep up, and leave the area tidy. You don't need to drag anything to the kerb unless you want to.",
  },
  {
    q: "How do I pay?",
    a: "Cash, bank transfer or card on the day. You'll get a clear price before we start — no hidden fees, no callout charges.",
  },
];

const PHONE = "0415 125 702";
const TEL = "tel:0415125702";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Stuff Gone Sorted | Rubbish Removal Perth — One Tonne Ute" },
      {
        name: "description",
        content:
          "Fast, reliable rubbish removal Perth. Furniture removal, garden waste, garage cleanouts & junk removal with a one tonne tray ute. Call 0415 125 702 for a free quote.",
      },
      { name: "keywords", content: "rubbish removal Perth, furniture removal Perth, garden waste removal Perth, garage cleanouts Perth, junk removal Perth, one tonne ute rubbish removal, fast local rubbish removal" },
      { property: "og:title", content: "Stuff Gone Sorted | Rubbish Removal Perth" },
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
  useReveal();
  const [submitted, setSubmitted] = useState(false);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const {
    register, handleSubmit, formState: { errors, isSubmitting }, reset,
  } = useForm<FormVals>({ resolver: zodResolver(schema) });

  useEffect(() => {
    // Load Google fonts
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;500;600;700;800&display=swap";
    document.head.appendChild(l);
    return () => { document.head.removeChild(l); };
  }, []);

  const onSubmit = async (_v: FormVals) => {
    await new Promise((r) => setTimeout(r, 600));
    setSubmitted(true);
    toast.success("Quote request sent! We'll be in touch shortly.");
    reset();
    setPhotoName(null);
  };

  // JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Stuff Gone Sorted",
    description: "Fast, reliable rubbish removal across Perth with a one-tonne tray ute.",
    telephone: "+61415125702",
    areaServed: "Perth, Western Australia",
    priceRange: "$$",
    address: { "@type": "PostalAddress", addressLocality: "Perth", addressRegion: "WA", addressCountry: "AU" },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster position="top-center" richColors />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* NAV */}
      <header className="sticky top-0 z-40 backdrop-blur bg-white/85 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2 group">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-yellow text-navy shadow-sm group-hover:rotate-6 transition-transform">
              <Truck className="h-5 w-5" />
            </span>
            <span className="font-display text-lg text-navy">Stuff Gone Sorted</span>
          </a>
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-navy/80">
            <a href="#services" className="hover:text-navy">Services</a>
            <a href="#why" className="hover:text-navy">Why us</a>
            <a href="#how" className="hover:text-navy">How it works</a>
            <a href="#faq" className="hover:text-navy">FAQ</a>
            <a href="#quote" className="hover:text-navy">Free quote</a>
          </nav>
          <a href={TEL} className="hidden sm:inline-flex items-center gap-2 rounded-full bg-navy text-white px-4 py-2 text-sm font-semibold hover:bg-navy/90 transition-colors shadow-sm">
            <Phone className="h-4 w-4" /> {PHONE}
          </a>
        </div>
      </header>

      {/* HERO */}
      <section id="top" className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white via-white to-yellow/20" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-12 pb-20 lg:pt-20 lg:pb-28 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-navy/5 text-navy px-3 py-1 text-xs font-semibold uppercase tracking-wider">
              <span className="h-2 w-2 rounded-full bg-yellow animate-pulse" /> Perth's local hauling crew
            </span>
            <h1 className="mt-5 font-display text-5xl sm:text-6xl lg:text-7xl leading-[0.95] text-navy">
              STUFF GONE.<br />
              <span className="text-yellow">SORTED.</span><br />
              <span className="brush text-navy">We'll take it!</span>
            </h1>
            <p className="mt-6 text-lg text-navy/70 max-w-xl">
              Fast, reliable <strong>rubbish removal across Perth</strong> with a one‑tonne tray ute. Furniture, garden waste, garage cleanouts and general junk — big or small, we haul it all.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={TEL} className="inline-flex items-center gap-2 rounded-full bg-navy text-white px-6 py-3.5 font-semibold shadow-lg shadow-navy/20 hover:-translate-y-0.5 hover:shadow-xl transition-all">
                <Phone className="h-5 w-5" /> Call {PHONE}
              </a>
              <a href="#quote" className="inline-flex items-center gap-2 rounded-full bg-yellow text-navy px-6 py-3.5 font-semibold hover:-translate-y-0.5 hover:bg-yellow/90 transition-all">
                Get a free quote <ArrowRight className="h-5 w-5" />
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {["Fast Service", "Fair Prices", "Licensed & Insured", "One Tonne Payload"].map((b, i) => (
                <span key={b} className="rounded-full bg-white border border-navy/10 px-3 py-1.5 text-xs font-semibold text-navy shadow-sm reveal" style={{ transitionDelay: `${i * 80}ms` }}>
                  ✓ {b}
                </span>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shadow-navy/20 ring-1 ring-navy/10">
              <img
                src={heroUte}
                alt="One tonne tray ute loaded with furniture and household rubbish in Perth"
                width={1280} height={1024}
                className="absolute inset-0 h-full w-full object-cover scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-navy/30 via-transparent to-transparent" />
            </div>
            {/* Floating badge */}
            <div className="absolute -top-5 -right-3 sm:-right-6 h-32 w-32 sm:h-40 sm:w-40 rounded-full bg-yellow text-navy flex flex-col items-center justify-center text-center p-3 shadow-xl animate-float ring-4 ring-white">
              <Weight className="h-5 w-5 mb-1" />
              <div className="font-display text-sm sm:text-base leading-tight">ONE TONNE<br/>PAYLOAD</div>
              <div className="text-[10px] sm:text-xs font-bold mt-1">Big jobs, no worries!</div>
            </div>
            {/* Floating phone card */}
            <a href={TEL} className="absolute -bottom-5 left-3 sm:left-6 bg-white rounded-2xl shadow-xl ring-1 ring-navy/10 px-4 py-3 flex items-center gap-3 hover:-translate-y-1 transition-transform">
              <span className="h-10 w-10 rounded-full bg-navy text-white flex items-center justify-center"><Phone className="h-4 w-4" /></span>
              <div>
                <div className="text-[11px] uppercase font-semibold text-navy/60 tracking-wider">Call for a free quote</div>
                <div className="font-display text-navy text-lg leading-none">{PHONE}</div>
              </div>
            </a>
          </div>
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
                { i: Weight, t: "One Tonne Payload" },
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

      {/* SERVICES */}
      <section id="services" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto reveal">
            <p className="text-yellow-foreground bg-yellow inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Services</p>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl text-navy">We'll take it!</h2>
            <p className="mt-4 text-navy/70">From a single couch to a full garage cleanout — we sort it quickly and cleanly across Perth.</p>
          </div>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { i: Boxes, t: "Household items", d: "Old appliances, boxes, mattresses & more." },
              { i: Sofa, t: "Furniture removal", d: "Couches, tables, beds — gone today." },
              { i: Leaf, t: "Garden waste", d: "Branches, clippings, soil, green waste." },
              { i: Trash2, t: "Rubbish removal", d: "General rubbish hauled and disposed." },
              { i: Warehouse, t: "Garage cleanouts", d: "Clear the clutter, reclaim the space." },
              { i: Truck, t: "Small moving jobs", d: "Single items or short‑distance hauls." },
              { i: Building2, t: "Office & shed cleanouts", d: "Old equipment, furniture, junk." },
              { i: Recycle, t: "General junk removal", d: "If it's junk, we'll take it." },
            ].map(({ i: I, t, d }, idx) => (
              <div key={t} className="group reveal rounded-2xl bg-white border border-navy/10 p-6 hover:-translate-y-1 hover:shadow-xl hover:border-yellow transition-all" style={{ transitionDelay: `${idx * 60}ms` }}>
                <div className="h-12 w-12 rounded-xl bg-yellow/30 text-navy flex items-center justify-center group-hover:bg-yellow group-hover:rotate-6 transition-all">
                  <I className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-display text-lg text-navy">{t}</h3>
                <p className="mt-1 text-sm text-navy/65">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section id="why" className="py-20 sm:py-28 bg-navy text-white relative overflow-hidden">
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-yellow/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-yellow/10 blur-3xl" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 relative">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 reveal">
              <p className="text-yellow text-xs font-bold uppercase tracking-wider">Why choose us</p>
              <h2 className="mt-3 font-display text-4xl sm:text-5xl">Local Perth muscle.<br/>No fuss, just sorted.</h2>
              <p className="mt-5 text-white/75">We're a reliable local Perth operator who picks up the phone, turns up on time, and gets the job done. Fair prices, strong work, and a one‑tonne tray ute ready for the next load.</p>
              <div className="mt-8 inline-flex items-center gap-4 rounded-2xl bg-white/10 backdrop-blur border border-white/15 px-5 py-4">
                <Counter to={1000} suffix="kg" />
                <div>
                  <div className="font-display text-xl">One Tonne Tray Ute</div>
                  <div className="text-sm text-white/70">Big payload, big jobs handled.</div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
              {[
                { i: Zap, t: "Fast replies", d: "Quick quotes, day or night." },
                { i: Clock, t: "On time", d: "We show up when we say." },
                { i: ThumbsUp, t: "No fuss", d: "Simple, friendly, sorted." },
                { i: Weight, t: "Strong & reliable", d: "Heavy lifting handled." },
                { i: DollarSign, t: "Fair prices", d: "Honest upfront quotes." },
                { i: MapPin, t: "Local Perth", d: "Perth & surrounding suburbs." },
                { i: ShieldCheck, t: "Licensed & insured", d: "Fully covered for peace of mind." },
                { i: Star, t: "Happy customers", d: "Quick replies. On time. No fuss." },
              ].map(({ i: I, t, d }, idx) => (
                <div key={t} className="reveal rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 p-5 flex gap-4 transition-colors" style={{ transitionDelay: `${idx * 50}ms` }}>
                  <span className="h-10 w-10 shrink-0 rounded-xl bg-yellow text-navy flex items-center justify-center"><I className="h-5 w-5" /></span>
                  <div>
                    <div className="font-display text-base">{t}</div>
                    <div className="text-sm text-white/70">{d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto reveal">
            <p className="bg-yellow inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-navy">How it works</p>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl text-navy">Sorted in 3 simple steps</h2>
          </div>
          <div className="mt-14 grid md:grid-cols-3 gap-6 relative">
            {[
              { n: "01", i: Phone, t: "Call or message us", d: "Ring 0415 125 702 or send a quick message — we reply fast." },
              { n: "02", i: Camera, t: "Send a photo or describe the job", d: "A quick photo helps us give you a fair upfront quote." },
              { n: "03", i: Truck, t: "We remove it — quickly & cleanly", d: "We turn up on time, load the ute and leave it spotless." },
            ].map(({ n, i: I, t, d }, idx) => (
              <div key={n} className="reveal relative rounded-3xl bg-white border border-navy/10 p-8 hover:-translate-y-1 hover:shadow-2xl transition-all" style={{ transitionDelay: `${idx * 120}ms` }}>
                <div className="absolute -top-5 left-6 h-12 px-4 rounded-full bg-navy text-white font-display flex items-center text-lg shadow-lg">{n}</div>
                <div className="mt-4 h-14 w-14 rounded-2xl bg-yellow/30 text-navy flex items-center justify-center">
                  <I className="h-7 w-7" />
                </div>
                <h3 className="mt-5 font-display text-xl text-navy">{t}</h3>
                <p className="mt-2 text-navy/65">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICE AREA */}
      <section className="py-20 bg-yellow/15">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-2 gap-10 items-center">
          <div className="reveal">
            <p className="text-navy bg-white inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Service area</p>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl text-navy">Servicing Perth & surrounding areas</h2>
            <p className="mt-4 text-navy/75 max-w-lg">Wherever you are in the Perth metro and nearby suburbs, we'll come to you. Friendly local crew, fair prices, and the same job-done attitude every time.</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Perth CBD", "Northern Suburbs", "Southern Suburbs", "Eastern Suburbs", "Western Suburbs", "Hills"].map((s) => (
                <span key={s} className="inline-flex items-center gap-1.5 rounded-full bg-white border border-navy/10 px-3 py-1.5 text-sm font-medium text-navy">
                  <MapPin className="h-3.5 w-3.5 text-yellow-foreground" /> {s}
                </span>
              ))}
            </div>
          </div>
          <div className="reveal relative">
            <div className="aspect-square max-w-md mx-auto rounded-full bg-gradient-to-br from-navy to-navy/70 relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "radial-gradient(circle at 30% 40%, rgba(255,255,255,0.18) 0 2px, transparent 3px), radial-gradient(circle at 70% 60%, rgba(255,255,255,0.18) 0 2px, transparent 3px)", backgroundSize: "60px 60px" }} />
              {/* concentric pulses */}
              <span className="absolute inset-0 m-auto h-20 w-20 rounded-full bg-yellow/40 animate-ping" />
              <span className="absolute inset-0 m-auto h-40 w-40 rounded-full border border-yellow/40 animate-pulse-slow" />
              <span className="absolute inset-0 m-auto h-64 w-64 rounded-full border border-yellow/20" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <MapPin className="h-12 w-12 text-yellow drop-shadow-lg animate-float" />
                <div className="mt-2 font-display text-2xl">Perth, WA</div>
                <div className="text-white/70 text-sm">We come to you</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUOTE CTA + FORM */}
      <section id="quote" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="rounded-3xl bg-navy text-white p-8 sm:p-12 lg:p-16 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 h-64 w-64 rounded-full bg-yellow/20 blur-3xl" />
            <div className="grid lg:grid-cols-2 gap-12 relative">
              <div className="reveal">
                <p className="text-yellow text-xs font-bold uppercase tracking-wider">Free quote</p>
                <h2 className="mt-3 font-display text-4xl sm:text-5xl">Need rubbish gone today?</h2>
                <p className="mt-4 text-white/80 max-w-md">Call or message for a free quote. Quick replies, fair pricing, and no fuss.</p>
                <a href={TEL} className="mt-8 block group">
                  <div className="text-xs uppercase tracking-wider text-yellow font-semibold">Call us now</div>
                  <div className="font-display text-5xl sm:text-6xl group-hover:text-yellow transition-colors">{PHONE}</div>
                </a>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href={TEL} className="inline-flex items-center gap-2 rounded-full bg-yellow text-navy px-6 py-3.5 font-semibold hover:-translate-y-0.5 transition-transform">
                    <Phone className="h-5 w-5" /> Call {PHONE}
                  </a>
                  <a href={`sms:0415125702`} className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 text-white px-6 py-3.5 font-semibold hover:bg-white/20 transition-colors">
                    <MessageSquare className="h-5 w-5" /> Message us
                  </a>
                </div>
                <div className="mt-8 flex flex-wrap gap-2 text-xs">
                  {["Quick replies", "On time", "No fuss", "Fair prices"].map((t) => (
                    <span key={t} className="rounded-full bg-white/10 border border-white/15 px-3 py-1 text-white/85">{t}</span>
                  ))}
                </div>
              </div>

              <div className="reveal rounded-2xl bg-white text-navy p-6 sm:p-8 shadow-2xl">
                {submitted ? (
                  <div className="text-center py-10">
                    <div className="mx-auto h-16 w-16 rounded-full bg-yellow flex items-center justify-center animate-pulse-slow">
                      <CheckCircle2 className="h-8 w-8 text-navy" />
                    </div>
                    <h3 className="mt-4 font-display text-2xl">Thanks — we've got it!</h3>
                    <p className="mt-2 text-navy/70">We'll be in touch shortly with your free quote. Need it gone today? Call <a href={TEL} className="underline font-semibold">{PHONE}</a>.</p>
                    <button onClick={() => setSubmitted(false)} className="mt-6 inline-flex items-center gap-2 rounded-full bg-navy text-white px-5 py-2.5 font-semibold hover:bg-navy/90">
                      Send another request
                    </button>
                  </div>
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
                      <textarea {...register("details")} maxLength={800} rows={4} className="input resize-none" placeholder="e.g. Old couch, 2 mattresses, and some garden waste from the back yard." />
                    </Field>
                    <Field label="Upload a photo (optional)">
                      <label className="flex items-center gap-3 rounded-xl border border-dashed border-navy/25 px-4 py-3 cursor-pointer hover:bg-yellow/10 transition-colors">
                        <Camera className="h-5 w-5 text-navy/60" />
                        <span className="text-sm text-navy/70 truncate">{photoName ?? "Tap to attach a photo of the job"}</span>
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => setPhotoName(e.target.files?.[0]?.name ?? null)} />
                      </label>
                    </Field>
                    <button type="submit" disabled={isSubmitting} className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-navy text-white py-3.5 font-semibold hover:bg-navy/90 disabled:opacity-70 transition-all">
                      {isSubmitting ? "Sending..." : (<>Send my free quote <Send className="h-4 w-4" /></>)}
                    </button>
                    <p className="text-xs text-navy/55 text-center">By submitting you agree to be contacted about your job. No spam, ever.</p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BADGES */}
      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { i: ShieldCheck, t: "Licensed & Insured" },
              { i: MapPin, t: "Local Perth Business" },
              { i: ThumbsUp, t: "Reliable Service" },
              { i: DollarSign, t: "Fair Prices" },
              { i: Weight, t: "One Tonne Payload" },
            ].map(({ i: I, t }, idx) => (
              <div key={t} className="reveal rounded-2xl bg-white border border-navy/10 p-5 flex flex-col items-center text-center gap-2 hover:border-yellow hover:-translate-y-1 transition-all" style={{ transitionDelay: `${idx * 60}ms` }}>
                <span className="h-12 w-12 rounded-full bg-yellow text-navy flex items-center justify-center"><I className="h-6 w-6" /></span>
                <div className="font-display text-sm text-navy">{t}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-navy text-white pt-14 pb-28 md:pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 grid md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-yellow text-navy">
                <Truck className="h-5 w-5" />
              </span>
              <span className="font-display text-xl">Stuff Gone Sorted</span>
            </div>
            <p className="mt-3 text-white/70 text-sm max-w-xs">Big or small, we haul it all. Fast, friendly rubbish removal across Perth, WA.</p>
          </div>
          <div className="text-sm">
            <div className="font-display text-lg mb-3">Contact</div>
            <a href={TEL} className="block hover:text-yellow"><Phone className="inline h-4 w-4 mr-2" />{PHONE}</a>
            <div className="mt-2 text-white/70"><MapPin className="inline h-4 w-4 mr-2" />Servicing Perth, Australia</div>
            <div className="mt-2 text-white/70"><ShieldCheck className="inline h-4 w-4 mr-2" />Licensed & Insured</div>
            <div className="mt-2 text-white/70"><MessageSquare className="inline h-4 w-4 mr-2" />Call or message for a free quote</div>
          </div>
          <div className="text-sm">
            <div className="font-display text-lg mb-3">Services</div>
            <ul className="space-y-1.5 text-white/70">
              <li>Rubbish removal Perth</li>
              <li>Furniture removal Perth</li>
              <li>Garden waste removal Perth</li>
              <li>Garage cleanouts Perth</li>
              <li>Junk removal Perth</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/50">
          © {new Date().getFullYear()} Stuff Gone Sorted. All rights reserved.
        </div>
      </footer>

      {/* Sticky mobile call */}
      <a href={TEL} className="md:hidden fixed bottom-4 inset-x-4 z-50 inline-flex items-center justify-center gap-2 rounded-full bg-yellow text-navy py-4 font-display text-lg shadow-2xl shadow-navy/30 active:scale-95 transition-transform">
        <Phone className="h-5 w-5" /> Call {PHONE}
      </a>
    </div>
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

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const dur = 1400;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setN(Math.floor(p * to));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <div className="font-display text-4xl text-yellow leading-none">{n}{suffix}</div>;
}
