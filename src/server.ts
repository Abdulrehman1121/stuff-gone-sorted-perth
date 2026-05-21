import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { bookingInputSchema } from "./lib/booking-schema";
import { sendBookingEmail, sendContactEmail } from "./lib/mailer";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => ((m as { default?: ServerEntry }).default ?? (m as unknown as ServerEntry)),
    );
  }
  return serverEntryPromise;
}

function brandedErrorResponse(): Response {
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isCatastrophicSsrErrorBody(body: string, responseStatus: number): boolean {
  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return false;
  }

  if (!payload || Array.isArray(payload) || typeof payload !== "object") {
    return false;
  }

  const fields = payload as Record<string, unknown>;
  const expectedKeys = new Set(["message", "status", "unhandled"]);
  if (!Object.keys(fields).every((key) => expectedKeys.has(key))) {
    return false;
  }

  return (
    fields.unhandled === true &&
    fields.message === "HTTPError" &&
    (fields.status === undefined || fields.status === responseStatus)
  );
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isCatastrophicSsrErrorBody(body, response.status)) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return brandedErrorResponse();
}

// --- API ROUTE HANDLERS ---

async function handleBookingApi(request: Request): Promise<Response> {
  try {
    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({ success: false, error: "Method Not Allowed" }),
        { status: 405, headers: { "Content-Type": "application/json" } }
      );
    }

    const body = await request.json();
    
    // Validate with Zod
    const result = bookingInputSchema.safeParse(body);
    if (!result.success) {
      const errorMessage = result.error.errors.map(e => e.message).join(" ");
      return new Response(
        JSON.stringify({ success: false, error: errorMessage || "Validation failed." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const bookingData = result.data;

    // Time validation (6 AM - 6 PM)
    const checkTime = (timeStr?: string) => {
      if (!timeStr) return true;
      const parts = timeStr.split(":");
      if (parts.length < 2) return false;
      const hours = parseInt(parts[0], 10);
      const minutes = parseInt(parts[1], 10);
      const totalMinutes = hours * 60 + minutes;
      return totalMinutes >= 360 && totalMinutes <= 1080;
    };

    if (!checkTime(bookingData.preferred_time) || (bookingData.alternative_time && !checkTime(bookingData.alternative_time))) {
      return new Response(
        JSON.stringify({ success: false, error: "Please choose a booking time between 6:00 AM and 6:00 PM." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Sync with local PHP/MySQL Database
    try {
      const phpUrl = "http://localhost/stuff-gone-sorted-perth/php/api.php?action=submit";
      const dbRes = await fetch(phpUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (dbRes.ok) {
        const dbData = await dbRes.json();
        console.log("[Database Sync] Persisted booking record to MySQL:", dbData);
      }
    } catch (dbErr: any) {
      console.warn("[Database Sync] PHP DB sync bypassed/unreachable:", dbErr.message || dbErr);
    }

    // Send SMTP email
    const emailResult = await sendBookingEmail({
      full_name: bookingData.full_name,
      email: bookingData.email,
      phone: bookingData.phone,
      suburb: bookingData.suburb,
      street_address: bookingData.street_address,
      contact_method: bookingData.contact_method,
      service_type: bookingData.service_type,
      item_description: bookingData.item_description,
      load_size: bookingData.load_size,
      access_notes: bookingData.access_notes,
      photo_url: bookingData.photo_url,
      preferred_date: bookingData.preferred_date,
      preferred_time: bookingData.preferred_time,
      alternative_date: bookingData.alternative_date,
      alternative_time: bookingData.alternative_time,
      urgency: bookingData.urgency,
      extra_notes: bookingData.item_description,
    });

    if (emailResult.success) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "Thank you. Your request has been received. We’ll contact you shortly.",
          messageId: emailResult.messageId
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Something went wrong. Please try again or call us directly.",
          details: emailResult.error
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (err: any) {
    console.error("[API Booking Error]:", err);
    return new Response(
      JSON.stringify({ success: false, error: "Something went wrong. Please try again or call us directly.", details: err.message || err }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

async function handleContactApi(request: Request): Promise<Response> {
  try {
    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({ success: false, error: "Method Not Allowed" }),
        { status: 405, headers: { "Content-Type": "application/json" } }
      );
    }

    const body = await request.json();
    const { name, phone, email, suburb, message, photo_url } = body;

    if (!name || !name.trim()) {
      return new Response(JSON.stringify({ success: false, error: "Name is required." }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    if (!phone || !phone.trim()) {
      return new Response(JSON.stringify({ success: false, error: "Phone number is required." }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    if (!suburb || !suburb.trim()) {
      return new Response(JSON.stringify({ success: false, error: "Suburb is required." }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    if (!message || !message.trim()) {
      return new Response(JSON.stringify({ success: false, error: "Message / details are required." }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    // Sync with Database
    try {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");

      const dbBookingPayload = {
        full_name: name.trim(),
        email: email && email.trim() ? email.trim() : "unknown@example.com",
        phone: phone.trim(),
        suburb: suburb.trim(),
        contact_method: "Call",
        service_type: "Rubbish removal",
        item_description: `[Contact Form Quote Request] ${message.trim()}`,
        preferred_date: `${year}-${month}-${day}`,
        preferred_time: "12:00 PM",
        urgency: "Flexible",
        photo_url: photo_url || undefined,
      };

      const phpUrl = "http://localhost/stuff-gone-sorted-perth/php/api.php?action=submit";
      const dbRes = await fetch(phpUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dbBookingPayload),
      });
      if (dbRes.ok) {
        const dbData = await dbRes.json();
        console.log("[Database Sync] Persisted contact record to MySQL:", dbData);
      }
    } catch (dbErr: any) {
      console.warn("[Database Sync] PHP DB sync bypassed/unreachable:", dbErr.message || dbErr);
    }

    // Send SMTP email
    const emailResult = await sendContactEmail({
      name: name.trim(),
      phone: phone.trim(),
      email: email && email.trim() ? email.trim() : "Not provided",
      suburb: suburb.trim(),
      message: message.trim(),
      photo_url: photo_url,
    });

    if (emailResult.success) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "Thank you. Your request has been received. We’ll contact you shortly.",
          messageId: emailResult.messageId
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Something went wrong. Please try again or call us directly.",
          details: emailResult.error
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (err: any) {
    console.error("[API Contact Error]:", err);
    return new Response(
      JSON.stringify({ success: false, error: "Something went wrong. Please try again or call us directly.", details: err.message || err }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const url = new URL(request.url);
      
      // Intercept our custom API endpoints
      if (url.pathname === "/api/booking") {
        return await handleBookingApi(request);
      } else if (url.pathname === "/api/contact") {
        return await handleContactApi(request);
      }

      // Default to SSR React app router
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return brandedErrorResponse();
    }
  },
};
