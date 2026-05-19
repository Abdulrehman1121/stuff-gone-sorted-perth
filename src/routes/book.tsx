import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { submitBooking } from "@/lib/bookings.functions";
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
import { CheckCircle2, Phone, Loader2, Upload, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/book")({
  component: BookPage,
  head: () => ({
    meta: [
      { title: "Book Rubbish Removal in Perth — Stuff Gone Sorted" },
      { name: "description", content: "Book your rubbish removal in Perth. Choose your preferred date and time — fast local rubbish removal with approval confirmation." },
    ],
  }),
});

function BookPage() {
  const submit = useServerFn(submitBooking);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const [serverError, setServerError] = useState<string | null>(null);

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
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("booking-photos").upload(path, file, {
      contentType: file.type, upsert: false,
    });
    setUploading(false);
    if (error) { setServerError(error.message); return; }
    const { data } = supabase.storage.from("booking-photos").getPublicUrl(path);
    setPhotoUrl(data.publicUrl);
    form.setValue("photo_url", data.publicUrl);
  };

  const onSubmit = form.handleSubmit(async (values) => {
    setServerError(null);
    setSubmitting(true);
    try {
      await submit({ data: { ...values, photo_url: photoUrl || undefined } });
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
      <div className="min-h-screen bg-gradient-to-br from-navy to-[#0a142e] flex items-center justify-center px-4 py-12">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-2xl p-8 text-center animate-[fade-up_0.6s_ease-out_both]">
          <div className="h-16 w-16 rounded-full bg-emerald-100 mx-auto flex items-center justify-center">
            <CheckCircle2 className="h-9 w-9 text-emerald-600" />
          </div>
          <h1 className="font-display text-2xl text-navy mt-4">Booking received</h1>
          <p className="text-slate-600 mt-2">
            Thanks! Your booking request has been received. We'll review your details and confirm by email or phone shortly.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            <a href="tel:0415125702" className="inline-flex items-center gap-2 bg-yellow text-navy font-semibold px-4 py-2 rounded-lg">
              <Phone className="h-4 w-4" /> 0415 125 702
            </a>
            <Link to="/" className="inline-flex items-center gap-2 border border-slate-300 px-4 py-2 rounded-lg text-navy">
              Back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-navy text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
          <Link to="/" className="inline-flex items-center gap-1 text-xs text-yellow hover:underline">
            <ArrowLeft className="h-3 w-3" /> Back to site
          </Link>
          <h1 className="font-display text-3xl sm:text-4xl mt-2">Book your rubbish removal in Perth</h1>
          <p className="text-slate-300 mt-2 max-w-2xl">
            Fast local rubbish removal with approval confirmation. Choose your preferred date and time — we'll review and confirm by email or phone.
          </p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <form onSubmit={onSubmit} className="space-y-8 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 animate-[fade-up_0.6s_ease-out_both]">
          <Section title="Your details">
            <Grid>
              <FormField label="Full name" error={form.formState.errors.full_name?.message}>
                <Input {...form.register("full_name")} placeholder="Jane Smith" />
              </FormField>
              <FormField label="Email" error={form.formState.errors.email?.message}>
                <Input type="email" {...form.register("email")} placeholder="you@example.com" />
              </FormField>
              <FormField label="Phone" error={form.formState.errors.phone?.message}>
                <Input {...form.register("phone")} placeholder="0415 ..." />
              </FormField>
              <FormField label="Suburb" error={form.formState.errors.suburb?.message}>
                <Input {...form.register("suburb")} placeholder="e.g. Scarborough" />
              </FormField>
              <FormField label="Street address (optional)" className="sm:col-span-2">
                <Input {...form.register("street_address")} placeholder="123 Example St" />
              </FormField>
              <FormField label="Preferred contact method">
                <NativeSelect {...form.register("contact_method")}>
                  {CONTACT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
                </NativeSelect>
              </FormField>
            </Grid>
          </Section>

          <Section title="Service details">
            <Grid>
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
              <FormField label="Description of items" className="sm:col-span-2">
                <Textarea rows={3} {...form.register("item_description")} placeholder="e.g. old couch, fridge, garden waste bags…" />
              </FormField>
              <FormField label="Access notes" className="sm:col-span-2">
                <Textarea rows={2} {...form.register("access_notes")} placeholder="Stairs, lift access, driveway, street parking, heavy items, etc." />
              </FormField>
              <FormField label="Photo (optional)" className="sm:col-span-2">
                <label className="flex items-center gap-3 border border-dashed border-slate-300 rounded-lg p-3 cursor-pointer hover:border-navy/40">
                  <Upload className="h-4 w-4 text-navy" />
                  <span className="text-sm text-slate-600">
                    {uploading ? "Uploading…" : photoUrl ? "Photo uploaded ✓ (tap to replace)" : "Tap to add a photo of the items"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
                  />
                </label>
                {photoUrl && (
                  <img src={photoUrl} alt="Uploaded" className="mt-2 h-24 w-24 object-cover rounded-lg border" />
                )}
              </FormField>
            </Grid>
          </Section>

          <Section title="Preferred schedule">
            <Grid>
              <FormField label="Preferred date" error={form.formState.errors.preferred_date?.message}>
                <Input type="date" {...form.register("preferred_date")} />
              </FormField>
              <FormField label="Preferred time" error={form.formState.errors.preferred_time?.message}>
                <Input type="time" {...form.register("preferred_time")} />
              </FormField>
              <FormField label="Alternative date">
                <Input type="date" {...form.register("alternative_date")} />
              </FormField>
              <FormField label="Alternative time">
                <Input type="time" {...form.register("alternative_time")} />
              </FormField>
              <FormField label="Urgency" className="sm:col-span-2">
                <NativeSelect {...form.register("urgency")}>
                  {URGENCIES.map((u) => <option key={u} value={u}>{u}</option>)}
                </NativeSelect>
              </FormField>
            </Grid>
          </Section>

          {serverError && <p className="text-sm text-destructive">{serverError}</p>}

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" disabled={submitting} className="bg-yellow text-navy hover:bg-yellow/90 font-bold px-6 h-12 text-base">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Request pickup time"}
            </Button>
            <a href="tel:0415125702" className="inline-flex items-center gap-2 text-navy font-semibold">
              <Phone className="h-4 w-4" /> Or call 0415 125 702
            </a>
          </div>
          <p className="text-xs text-muted-foreground">
            Bookings stay <strong>Pending Approval</strong> until we confirm. We'll email or call you with the approved date and time.
          </p>
        </form>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-navy text-lg mb-3">{title}</h2>
      {children}
    </section>
  );
}
function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid sm:grid-cols-2 gap-4">{children}</div>;
}
function FormField({ label, children, error, className = "" }: { label: string; children: React.ReactNode; error?: string; className?: string }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
function NativeSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
    />
  );
}
