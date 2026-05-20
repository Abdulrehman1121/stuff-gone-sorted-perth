import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { apiRequest, uploadPhoto } from "@/lib/api-client";
import {
  bookingInputSchema,
  SERVICE_TYPES,
  LOAD_SIZES,
  URGENCIES,
  CONTACT_METHODS,
  type BookingInput,
} from "@/lib/booking-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Phone, Loader2, Upload, ArrowLeft, ArrowRight, ShieldCheck, ThumbsUp, Star } from "lucide-react";
import logoImage from "@/assets/haulmate-wa-logo.webp";

export const Route = createFileRoute("/book")({
  component: BookPage,
  head: () => ({
    meta: [
      { title: "Book Rubbish Removal in Perth — HaulMate WA" },
      { name: "description", content: "Book your rubbish removal in Perth. Choose your preferred date and time — fast local rubbish removal with approval confirmation." },
    ],
  }),
});

const getTodayString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

function BookPage() {
  const minDate = getTodayString();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const [serverError, setServerError] = useState<string | null>(null);

  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const form = useForm<BookingInput>({
    resolver: zodResolver(bookingInputSchema),
    defaultValues: {
      contact_method: "Call",
      service_type: "Rubbish removal",
      load_size: "Not sure",
      urgency: "Flexible",
    },
  });

  const onUpload = async (file: File) => {
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      setServerError("Photo must be under 8MB");
      return;
    }
    setUploading(true);
    setServerError(null);
    try {
      const publicUrl = await uploadPhoto(file);
      setPhotoUrl(publicUrl);
      form.setValue("photo_url", publicUrl);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };


  const nextStep = async () => {
    let fieldsToValidate: Array<keyof BookingInput> = [];
    if (step === 1) {
      fieldsToValidate = ["full_name", "email", "phone", "suburb", "street_address", "contact_method"];
    } else if (step === 2) {
      fieldsToValidate = ["service_type", "load_size", "item_description", "access_notes"];
    }

    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const onSubmit = form.handleSubmit(async (values) => {
    setServerError(null);
    setSubmitting(true);
    try {
      await apiRequest("submit", {
        method: "POST",
        body: JSON.stringify({ ...values, photo_url: photoUrl || undefined }),
      });
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  });


  if (submitted) {
    return (
      <div className="min-h-[85vh] bg-slate-50 flex items-center justify-center px-4 py-8">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-slate-100">
          <div className="h-16 w-16 rounded-full bg-emerald-100 mx-auto flex items-center justify-center">
            <CheckCircle2 className="h-9 w-9 text-emerald-600" />
          </div>
          <h1 className="font-display text-2xl text-navy mt-4">Booking Request Received</h1>
          <p className="text-slate-600 mt-2">
            Thanks! Your booking request has been received. We will review your details and confirm your slot by email or phone shortly.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            <a href="tel:0415125702" className="inline-flex items-center gap-2 bg-yellow text-navy font-semibold px-4 py-2.5 rounded-full hover:bg-yellow/90 shadow transition-colors">
              <Phone className="h-4 w-4" /> 0415 125 702
            </a>
            <Link to="/" className="inline-flex items-center gap-2 border border-slate-300 px-4 py-2.5 rounded-full text-navy hover:bg-slate-50 transition-colors">
              Back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Attractive Hero Section */}
      <section className="relative overflow-hidden bg-navy text-white pt-16 pb-24">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-navy via-navy to-[#1e3a8a] opacity-90" />
        <div className="absolute -top-10 -right-10 h-64 w-64 rounded-full bg-yellow/10 blur-3xl" />
        
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 text-yellow px-3 py-1 text-xs font-semibold uppercase tracking-wider mb-4">
            ✓ Quick 60-Second Booking
          </span>
          <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl leading-tight">
            Book Your <span className="text-yellow">Rubbish Removal</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            Select your service type, upload an optional photo, and choose your preferred date. We'll handle all the lifting and confirm your slot instantly!
          </p>
        </div>
      </section>

      {/* Stepper Container (Overlapping the Hero) */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-12 pb-16 relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden grid md:grid-cols-12 min-h-[580px]">
        
        {/* LEFT COLUMN: Sidebar info */}
        <div className="md:col-span-4 bg-navy text-white p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-10 -left-10 h-32 w-32 rounded-full bg-yellow/10 blur-2xl" />
          <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-yellow/10 blur-2xl" />
          
          <div className="relative">
            <div className="flex items-center gap-2 mb-8">
              <img src={logoImage} alt="HaulMate WA" className="h-8 w-8 rounded-full object-cover" />
              <span className="font-display text-lg tracking-wide">HaulMate WA</span>
            </div>
            
            <h2 className="font-display text-xl sm:text-3xl leading-tight mb-4 text-yellow">
              Book Your Rubbish Removal
            </h2>
            <p className="text-sm text-slate-300 mb-8 leading-relaxed">
              Fill in your details in 3 quick steps. We'll confirm your slot rapidly.
            </p>
            
            {/* Step Indicators */}
            <div className="space-y-4">
              {[
                { number: 1, label: "Your Details" },
                { number: 2, label: "Service Details" },
                { number: 3, label: "Preferred Schedule" },
              ].map((s) => (
                <div
                  key={s.number}
                  className="flex items-center gap-3 cursor-pointer group"
                  onClick={scrollToForm}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && scrollToForm()}
                >
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${
                    step === s.number
                      ? "bg-yellow text-navy"
                      : step > s.number
                      ? "bg-emerald-500 text-white"
                      : "bg-white/10 text-white/60"
                  }`}>
                    {step > s.number ? "✓" : s.number}
                  </div>
                  <span className={`text-sm font-semibold transition-colors duration-300 group-hover:text-white ${
                    step === s.number ? "text-white" : "text-white/50"
                  }`}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mt-8 space-y-3 border-t border-white/10 pt-6">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <ShieldCheck className="h-4 w-4 text-yellow" />
              Fully Licensed & Insured
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Star className="h-4 w-4 text-yellow" />
              Perth's Top-Rated Local Team
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: The Step Form */}
        <div ref={formRef} className="md:col-span-8 p-6 sm:p-10 flex flex-col justify-between min-h-[500px]">
          <div>
            {/* Header progress */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Step {step} of 3
              </span>
              <div className="h-1.5 w-32 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow transition-all duration-300"
                  style={{ width: `${(step / 3) * 100}%` }}
                />
              </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-6" noValidate>
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField label="Full name" error={form.formState.errors.full_name?.message}>
                        <Input {...form.register("full_name")} placeholder="Jane Smith" className="rounded-xl border-slate-200" />
                      </FormField>
                      <FormField label="Email" error={form.formState.errors.email?.message}>
                        <Input type="email" {...form.register("email")} placeholder="you@example.com" className="rounded-xl border-slate-200" />
                      </FormField>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField label="Phone number" error={form.formState.errors.phone?.message}>
                        <Input {...form.register("phone")} placeholder="0415 ..." className="rounded-xl border-slate-200" />
                      </FormField>
                      <FormField label="Suburb" error={form.formState.errors.suburb?.message}>
                        <Input {...form.register("suburb")} placeholder="e.g. Scarborough" className="rounded-xl border-slate-200" />
                      </FormField>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2">
                        <FormField label="Street address (optional)">
                          <Input {...form.register("street_address")} placeholder="123 Example St" className="rounded-xl border-slate-200" />
                        </FormField>
                      </div>
                      <FormField label="Preferred contact method">
                        <NativeSelect {...form.register("contact_method")}>
                          {CONTACT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
                        </NativeSelect>
                      </FormField>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField label="Service type" error={form.formState.errors.service_type?.message}>
                        <NativeSelect {...form.register("service_type")}>
                          {SERVICE_TYPES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </NativeSelect>
                      </FormField>
                      <FormField label="Approximate load size">
                        <NativeSelect {...form.register("load_size")}>
                          {LOAD_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </NativeSelect>
                      </FormField>
                    </div>

                    <FormField label="Description of items" error={form.formState.errors.item_description?.message}>
                      <Textarea rows={3} {...form.register("item_description")} placeholder="e.g. old couch, fridge, garden waste bags…" className="rounded-xl border-slate-200 resize-none" />
                    </FormField>

                    <FormField label="Access notes">
                      <Input {...form.register("access_notes")} placeholder="Stairs, lift, heavy items, driveway access, etc." className="rounded-xl border-slate-200" />
                    </FormField>

                    <FormField label="Photo (optional)">
                      <label className="flex items-center gap-3 border border-dashed border-slate-300 rounded-xl p-3 cursor-pointer hover:border-navy/40 transition-colors">
                        <Upload className="h-4 w-4 text-navy" />
                        <span className="text-sm text-slate-600 truncate">
                          {uploading ? "Uploading…" : photoUrl ? "Photo uploaded ✓" : "Tap to upload a photo of the items"}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
                        />
                      </label>
                      {photoUrl && (
                        <img src={photoUrl} alt="Uploaded preview" className="mt-2 h-14 w-14 object-cover rounded-lg border" />
                      )}
                    </FormField>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField label="Preferred date" error={form.formState.errors.preferred_date?.message}>
                        <Input type="date" min={minDate} {...form.register("preferred_date")} className="rounded-xl border-slate-200" />
                      </FormField>
                      <FormField label="Preferred time (6 AM – 6 PM)" error={form.formState.errors.preferred_time?.message}>
                        <Input type="time" min="06:00" max="18:00" {...form.register("preferred_time")} className="rounded-xl border-slate-200" />
                      </FormField>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField label="Alternative date">
                        <Input type="date" min={minDate} {...form.register("alternative_date")} className="rounded-xl border-slate-200" />
                      </FormField>
                      <FormField label="Alternative time (6 AM – 6 PM)" error={form.formState.errors.alternative_time?.message}>
                        <Input type="time" min="06:00" max="18:00" {...form.register("alternative_time")} className="rounded-xl border-slate-200" />
                      </FormField>
                    </div>

                    <FormField label="Urgency">
                      <NativeSelect {...form.register("urgency")}>
                        {URGENCIES.map((u) => <option key={u} value={u}>{u}</option>)}
                      </NativeSelect>
                    </FormField>

                    {serverError && <p className="text-xs text-destructive">{serverError}</p>}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>

          {/* Bottom buttons */}
          <div className="mt-8 flex justify-between gap-4 border-t border-slate-100 pt-6">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={prevStep} className="rounded-full px-6 border-slate-300">
                Back
              </Button>
            ) : (
              <div /> // spacer
            )}

            {step < 3 ? (
              <Button type="button" onClick={nextStep} className="bg-yellow text-navy hover:bg-yellow/90 rounded-full px-6 font-semibold gap-1">
                Next Step <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button type="button" onClick={onSubmit} disabled={submitting} className="bg-navy text-white hover:bg-navy/95 rounded-full px-8 font-semibold gap-2">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Booking"}
              </Button>
            )}
          </div>
        </div>

      </div>
      </div>
    </div>
  );
}

function FormField({ label, children, error, className = "" }: { label: string; children: React.ReactNode; error?: string; className?: string }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <Label className="text-slate-700 font-semibold text-xs">{label}</Label>
      {children}
      {error && <p className="text-[11px] text-destructive font-medium leading-none mt-1">{error}</p>}
    </div>
  );
}

function NativeSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="flex h-9 w-full rounded-xl border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring transition-all"
    />
  );
}
