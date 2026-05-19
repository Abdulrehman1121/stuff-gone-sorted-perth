import { sendLovableEmail } from "@lovable.dev/email-js";

const BUSINESS_EMAIL = "abdulrehmankaleem195@gmail.com";
const BUSINESS_NAME = "Stuff Gone Sorted";
const BUSINESS_PHONE = "0415 125 702";

function getSenderDomain() {
  // Set after email domain is configured. Falls back gracefully.
  return process.env.EMAIL_SENDER_DOMAIN || process.env.LOVABLE_EMAIL_SENDER_DOMAIN || "";
}

function getFromAddress() {
  const domain = getSenderDomain();
  if (!domain) return "";
  return `${BUSINESS_NAME} <bookings@${domain}>`;
}

export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  text: string;
  idempotencyKey?: string;
}) {
  const apiKey = process.env.LOVABLE_API_KEY;
  const senderDomain = getSenderDomain();
  const from = getFromAddress();

  if (!apiKey || !senderDomain || !from) {
    console.warn("[email] Skipped — email domain not configured. Subject:", opts.subject);
    return { success: false, skipped: true as const };
  }

  try {
    const result = await sendLovableEmail(
      {
        to: opts.to,
        from,
        sender_domain: senderDomain,
        subject: opts.subject,
        html: opts.html,
        text: opts.text,
        purpose: "transactional",
        reply_to: BUSINESS_EMAIL,
        idempotency_key: opts.idempotencyKey,
      },
      { apiKey }
    );
    return { ...result, success: true as const };
  } catch (err) {
    console.error("[email] send failed:", err);
    return { success: false as const, error: err instanceof Error ? err.message : "unknown" };
  }
}

export type BookingForEmail = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  suburb: string;
  street_address: string | null;
  contact_method: string;
  service_type: string;
  item_description: string | null;
  load_size: string | null;
  access_notes: string | null;
  photo_url: string | null;
  preferred_date: string;
  preferred_time: string;
  alternative_date: string | null;
  alternative_time: string | null;
  urgency: string | null;
  approved_date: string | null;
  approved_time: string | null;
};

function row(label: string, value: string | null | undefined) {
  if (!value) return "";
  return `<tr><td style="padding:6px 12px;color:#64748b;font-size:13px;">${label}</td><td style="padding:6px 12px;color:#0f172a;font-size:14px;font-weight:500;">${value}</td></tr>`;
}

export function newBookingEmail(b: BookingForEmail, adminUrl: string) {
  const photoLine = b.photo_url
    ? `<p style="margin:12px 0;"><a href="${b.photo_url}" style="color:#1e3a8a;">View uploaded photo</a></p>`
    : "";
  const html = `
  <div style="font-family:Inter,Arial,sans-serif;background:#f8fafc;padding:24px;">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
      <div style="background:#0f1b3d;color:#fde047;padding:20px 24px;">
        <h1 style="margin:0;font-size:20px;">New Booking Request</h1>
        <p style="margin:4px 0 0;color:#cbd5e1;font-size:13px;">Status: Pending Approval</p>
      </div>
      <div style="padding:20px 24px;">
        <h2 style="margin:0 0 8px;font-size:15px;color:#0f172a;">Customer</h2>
        <table style="width:100%;border-collapse:collapse;">
          ${row("Name", b.full_name)}
          ${row("Email", b.email)}
          ${row("Phone", b.phone)}
          ${row("Suburb", b.suburb)}
          ${row("Address", b.street_address)}
          ${row("Preferred contact", b.contact_method)}
        </table>
        <h2 style="margin:18px 0 8px;font-size:15px;color:#0f172a;">Service</h2>
        <table style="width:100%;border-collapse:collapse;">
          ${row("Service", b.service_type)}
          ${row("Load size", b.load_size)}
          ${row("Items", b.item_description)}
          ${row("Access notes", b.access_notes)}
        </table>
        ${photoLine}
        <h2 style="margin:18px 0 8px;font-size:15px;color:#0f172a;">Preferred schedule</h2>
        <table style="width:100%;border-collapse:collapse;">
          ${row("Preferred date", b.preferred_date)}
          ${row("Preferred time", b.preferred_time)}
          ${row("Alternative date", b.alternative_date)}
          ${row("Alternative time", b.alternative_time)}
          ${row("Urgency", b.urgency)}
        </table>
        <div style="margin-top:24px;text-align:center;">
          <a href="${adminUrl}" style="display:inline-block;background:#fde047;color:#0f1b3d;text-decoration:none;padding:12px 22px;border-radius:8px;font-weight:700;">Open admin dashboard</a>
        </div>
      </div>
    </div>
  </div>`;
  const text = `New booking from ${b.full_name} (${b.email}, ${b.phone}) in ${b.suburb}. Service: ${b.service_type}. Preferred: ${b.preferred_date} ${b.preferred_time}. Admin: ${adminUrl}`;
  return { subject: "New Booking Request - Stuff Gone Sorted", html, text };
}

export function approvedBookingEmail(b: BookingForEmail) {
  const date = b.approved_date || b.preferred_date;
  const time = b.approved_time || b.preferred_time;
  const html = `
  <div style="font-family:Inter,Arial,sans-serif;background:#f8fafc;padding:24px;">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
      <div style="background:#0f1b3d;color:#fde047;padding:24px;">
        <h1 style="margin:0;font-size:22px;">Your booking is approved</h1>
      </div>
      <div style="padding:24px;color:#0f172a;">
        <p>Hi ${b.full_name},</p>
        <p>Good news — your rubbish removal booking has been <strong>approved</strong>.</p>
        <div style="background:#f1f5f9;border-radius:10px;padding:16px;margin:16px 0;">
          <p style="margin:4px 0;"><strong>Service:</strong> ${b.service_type}</p>
          <p style="margin:4px 0;"><strong>Date:</strong> ${date}</p>
          <p style="margin:4px 0;"><strong>Time:</strong> ${time}</p>
          <p style="margin:4px 0;"><strong>Location:</strong> ${b.suburb}${b.street_address ? ` — ${b.street_address}` : ""}</p>
          ${b.load_size ? `<p style="margin:4px 0;"><strong>Load size:</strong> ${b.load_size}</p>` : ""}
          ${b.item_description ? `<p style="margin:4px 0;"><strong>Notes:</strong> ${b.item_description}</p>` : ""}
          ${b.access_notes ? `<p style="margin:4px 0;"><strong>Access:</strong> ${b.access_notes}</p>` : ""}
        </div>
        <p>We'll arrive on time and contact you if we need any extra details.</p>
        <p>Thanks,<br/>${BUSINESS_NAME}<br/>Phone: ${BUSINESS_PHONE}</p>
      </div>
    </div>
  </div>`;
  const text = `Hi ${b.full_name}, your booking is approved. Service: ${b.service_type}. Date: ${date}. Time: ${time}. Location: ${b.suburb}. Call ${BUSINESS_PHONE} if you need anything. — ${BUSINESS_NAME}`;
  return { subject: "Your Booking Has Been Approved - Stuff Gone Sorted", html, text };
}

export function rejectedBookingEmail(b: BookingForEmail, adminNote?: string) {
  const html = `
  <div style="font-family:Inter,Arial,sans-serif;background:#f8fafc;padding:24px;">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
      <div style="background:#0f1b3d;color:#fde047;padding:24px;">
        <h1 style="margin:0;font-size:20px;">About your booking request</h1>
      </div>
      <div style="padding:24px;color:#0f172a;">
        <p>Hi ${b.full_name},</p>
        <p>Thanks for reaching out to ${BUSINESS_NAME}. Unfortunately we're unable to confirm your booking for ${b.preferred_date} at ${b.preferred_time}.</p>
        ${adminNote ? `<p style="background:#f1f5f9;padding:12px;border-radius:8px;">${adminNote}</p>` : ""}
        <p>Please give us a call or send a quick message on <a href="tel:${BUSINESS_PHONE}" style="color:#1e3a8a;">${BUSINESS_PHONE}</a> and we'll find another time that works.</p>
        <p>Thanks,<br/>${BUSINESS_NAME}</p>
      </div>
    </div>
  </div>`;
  const text = `Hi ${b.full_name}, we couldn't confirm your booking. Please call ${BUSINESS_PHONE} to arrange another time. — ${BUSINESS_NAME}`;
  return { subject: "Update on Your Booking Request - Stuff Gone Sorted", html, text };
}
