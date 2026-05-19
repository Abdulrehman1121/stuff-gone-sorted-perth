import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getRequest } from "@tanstack/react-start/server";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { bookingInputSchema } from "./booking-schema";
import {
  sendEmail,
  newBookingEmail,
  approvedBookingEmail,
  rejectedBookingEmail,
  type BookingForEmail,
} from "./email.server";

const BUSINESS_EMAIL = "abdulrehmankaleem195@gmail.com";

function nullify<T extends Record<string, unknown>>(input: T): T {
  const out: Record<string, unknown> = { ...input };
  for (const k of Object.keys(out)) {
    if (out[k] === "" || out[k] === undefined) out[k] = null;
  }
  return out as T;
}

async function requireAdmin(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error("Failed to verify admin");
  if (!data) throw new Error("Forbidden: admin access required");
}

// Public: submit a booking
export const submitBooking = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => bookingInputSchema.parse(input))
  .handler(async ({ data }) => {
    const payload = nullify({
      ...data,
      status: "pending_approval" as const,
    });

    const { data: created, error } = await supabaseAdmin
      .from("bookings")
      .insert(payload)
      .select("*")
      .single();
    if (error || !created) throw new Error(error?.message || "Failed to save booking");

    // Build admin URL from request origin
    let origin = "https://stuff-gone-sorted-perth.lovable.app";
    try {
      const req = getRequest();
      const url = new URL(req.url);
      origin = `${url.protocol}//${url.host}`;
    } catch {}
    const adminUrl = `${origin}/admin`;

    const tmpl = newBookingEmail(created as BookingForEmail, adminUrl);
    await sendEmail({
      to: BUSINESS_EMAIL,
      subject: tmpl.subject,
      html: tmpl.html,
      text: tmpl.text,
      idempotencyKey: `new-booking-${created.id}`,
    });

    return { id: created.id };
  });

// Admin: list all bookings
export const listBookings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context.userId);
    const { data, error } = await supabaseAdmin
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1000);
    if (error) throw new Error(error.message);
    return { bookings: data || [] };
  });

const updateStatusInput = z.object({
  id: z.string().uuid(),
  status: z.enum(["pending_approval", "approved", "rejected", "completed", "cancelled"]),
  approved_date: z.string().optional().nullable(),
  approved_time: z.string().optional().nullable(),
  admin_notes: z.string().max(2000).optional().nullable(),
});

// Admin: update a booking status (approve/reject/complete/cancel + edit dates)
export const updateBookingStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => updateStatusInput.parse(input))
  .handler(async ({ data, context }) => {
    await requireAdmin(context.userId);

    const update: Record<string, unknown> = { status: data.status };
    if (data.status === "approved") {
      update.approved_date = data.approved_date || null;
      update.approved_time = data.approved_time || null;
    }
    if (data.admin_notes !== undefined) update.admin_notes = data.admin_notes;

    const { data: updated, error } = await supabaseAdmin
      .from("bookings")
      .update(update)
      .eq("id", data.id)
      .select("*")
      .single();
    if (error || !updated) throw new Error(error?.message || "Failed to update");

    const b = updated as BookingForEmail;
    if (data.status === "approved") {
      const tmpl = approvedBookingEmail(b);
      await sendEmail({
        to: b.email,
        subject: tmpl.subject,
        html: tmpl.html,
        text: tmpl.text,
        idempotencyKey: `approved-${b.id}-${b.approved_date}-${b.approved_time}`,
      });
    } else if (data.status === "rejected") {
      const tmpl = rejectedBookingEmail(b, data.admin_notes || undefined);
      await sendEmail({
        to: b.email,
        subject: tmpl.subject,
        html: tmpl.html,
        text: tmpl.text,
        idempotencyKey: `rejected-${b.id}`,
      });
    }

    return { booking: updated };
  });
