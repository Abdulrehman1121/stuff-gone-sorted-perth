import nodemailer from "nodemailer";

// Simple type definitions for our mailer inputs
export interface BookingMailData {
  full_name: string;
  email: string;
  phone: string;
  suburb: string;
  street_address?: string;
  contact_method: string;
  service_type: string;
  item_description?: string;
  load_size?: string;
  access_notes?: string;
  photo_url?: string;
  preferred_date: string;
  preferred_time: string;
  alternative_date?: string;
  alternative_time?: string;
  urgency?: string;
  extra_notes?: string;
}

export interface ContactMailData {
  name: string;
  phone: string;
  email?: string;
  suburb: string;
  message: string;
  photo_url?: string;
}

// SMTP Credentials loaded from environment variables
const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587", 10);
const SMTP_SECURE = process.env.SMTP_SECURE === "true"; // true for 465, false for 587
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";
const SMTP_FROM = process.env.SMTP_FROM || "HaulMate WA <your-smtp-email@example.com>";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "abdulrehmanmakki18@gmail.com";

// Create a singleton transporter instance
let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!transporter) {
    if (!SMTP_USER || !SMTP_PASS) {
      console.warn(
        "[SMTP Mailer] SMTP credentials are not configured in environment variables. Email sending may fail."
      );
    }
    
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
      tls: {
        // Do not fail on invalid certs
        rejectUnauthorized: false,
      },
    });

    // Verify SMTP connection configuration in development
    if (process.env.NODE_ENV !== "production") {
      transporter.verify((error) => {
        if (error) {
          console.error("[SMTP Mailer] SMTP transporter verification failed:", error.message);
        } else {
          console.log("[SMTP Mailer] SMTP Server connection verified and ready.");
        }
      });
    }
  }
  return transporter;
}

// Helper to format values elegantly in HTML rows
function formatRow(label: string, value: string | null | undefined): string {
  const displayVal = value && value.trim() ? value : "Not provided";
  return `
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 10px 12px; color: #64748b; font-size: 13px; width: 35%; font-weight: 600; text-transform: uppercase; tracking: 0.05em; vertical-align: top;">${label}</td>
      <td style="padding: 10px 12px; color: #0f172a; font-size: 14px; font-weight: 500; vertical-align: top;">${displayVal}</td>
    </tr>
  `;
}

// Generate the beautiful HTML base frame
function getEmailLayout(title: string, tableRowsHtml: string, photoUrl?: string): string {
  const submissionTime = new Date().toLocaleString("en-AU", {
    timeZone: "Australia/Perth",
    dateStyle: "full",
    timeStyle: "medium",
  }) + " (AWST)";

  const photoSection = photoUrl && photoUrl.trim()
    ? `
      <div style="margin-top: 24px; padding: 16px; border: 1px dashed #cbd5e1; border-radius: 12px; background: #f8fafc; text-align: center;">
        <p style="margin: 0 0 12px; font-weight: 600; font-size: 14px; color: #0f172a;">Uploaded Photo Attachment</p>
        <a href="${photoUrl}" target="_blank" style="display: inline-block;">
          <img src="${photoUrl}" alt="Customer Rubbish Photo" style="max-width: 100%; max-height: 250px; border-radius: 8px; border: 1px solid #e2e8f0; display: block; margin: 0 auto; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);" />
        </a>
        <p style="margin: 8px 0 0; font-size: 12px;"><a href="${photoUrl}" target="_blank" style="color: #0f1b3d; text-decoration: underline; font-weight: 600;">Open image in browser</a></p>
      </div>
    `
    : "";

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
        <div style="background-color: #f1f5f9; padding: 32px 16px;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
            
            <!-- Branding Header -->
            <div style="background: #0f1b3d; padding: 28px 24px; text-align: center; border-bottom: 4px solid #fde047;">
              <h2 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase;">HaulMate WA</h2>
              <p style="margin: 6px 0 0; color: #fde047; font-size: 13px; font-weight: 600; tracking: 0.1em;">PERTH'S LOCAL RUBBISH REMOVAL TEAM</p>
            </div>

            <!-- Email Body Content -->
            <div style="padding: 24px 30px;">
              <h3 style="margin: 0 0 18px; color: #0f172a; font-size: 18px; font-weight: 700; border-bottom: 2px solid #cbd5e1; padding-bottom: 8px;">
                ${title}
              </h3>
              
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px;">
                <tbody>
                  ${tableRowsHtml}
                  ${formatRow("Submitted At", submissionTime)}
                </tbody>
              </table>

              ${photoSection}
            </div>

            <!-- Footer Section -->
            <div style="background: #f8fafc; padding: 20px 24px; text-align: center; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 12px; font-weight: 500; line-height: 1.5;">
              <p style="margin: 0 0 4px;">This message was sent from the <strong style="color: #0f172a;">HaulMate WA</strong> website.</p>
              <p style="margin: 0;">© ${new Date().getFullYear()} HaulMate WA. All Rights Reserved.</p>
            </div>
            
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Sends a Booking Form submission email notification
 */
export async function sendBookingEmail(data: BookingMailData): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const subject = "New Booking Request - HaulMate WA";
  
  const rows = [
    formatRow("Full Name", data.full_name),
    formatRow("Email Address", data.email),
    formatRow("Phone Number", data.phone),
    formatRow("Suburb", data.suburb),
    formatRow("Street Address", data.street_address),
    formatRow("Preferred Contact", data.contact_method),
    formatRow("Service Type", data.service_type),
    formatRow("Load Size", data.load_size),
    formatRow("Items / Rubbish details", data.item_description),
    formatRow("Access Notes", data.access_notes),
    formatRow("Preferred Date", data.preferred_date),
    formatRow("Preferred Time", data.preferred_time),
    formatRow("Alternative Date", data.alternative_date),
    formatRow("Alternative Time", data.alternative_time),
    formatRow("Urgency", data.urgency),
    formatRow("Extra Message / Notes", data.extra_notes),
  ].join("\n");

  const html = getEmailLayout("New Booking Request", rows, data.photo_url);
  const text = `
    New Booking Request - HaulMate WA
    ---------------------------------
    Name: ${data.full_name}
    Email: ${data.email}
    Phone: ${data.phone}
    Suburb: ${data.suburb}
    Address: ${data.street_address || "Not provided"}
    Preferred Contact: ${data.contact_method}
    Service: ${data.service_type}
    Load Size: ${data.load_size || "Not provided"}
    Items: ${data.item_description || "Not provided"}
    Access: ${data.access_notes || "Not provided"}
    Preferred: ${data.preferred_date} at ${data.preferred_time}
    Alternative: ${data.alternative_date || "Not provided"} at ${data.alternative_time || "Not provided"}
    Urgency: ${data.urgency || "Not provided"}
    Extra Notes: ${data.extra_notes || "Not provided"}
    Photo Link: ${data.photo_url || "Not provided"}
    
    This message was sent from the HaulMate WA website.
  `;

  try {
    const client = getTransporter();
    const info = await client.sendMail({
      from: SMTP_FROM,
      to: ADMIN_EMAIL,
      subject: subject,
      html: html,
      text: text,
      replyTo: data.email && data.email.trim() ? data.email : undefined,
    });
    
    if (process.env.NODE_ENV !== "production") {
      console.log(`[SMTP Mailer] Booking email successfully sent: ${info.messageId}`);
    }
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error("[SMTP Mailer] Failed to send Booking email via SMTP:", error.message || error);
    return { success: false, error: error.message || "Unknown error" };
  }
}

/**
 * Sends a Contact / Free Quote Form submission email notification
 */
export async function sendContactEmail(data: ContactMailData): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const subject = "New Contact / Quote Request - HaulMate WA";

  const rows = [
    formatRow("Name", data.name),
    formatRow("Phone Number", data.phone),
    formatRow("Email Address", data.email),
    formatRow("Suburb", data.suburb),
    formatRow("Message / What needs removing", data.message),
  ].join("\n");

  const html = getEmailLayout("New Contact / Quote Request", rows, data.photo_url);
  const text = `
    New Contact / Quote Request - HaulMate WA
    -----------------------------------------
    Name: ${data.name}
    Phone: ${data.phone}
    Email: ${data.email || "Not provided"}
    Suburb: ${data.suburb}
    Message: ${data.message}
    Photo Link: ${data.photo_url || "Not provided"}
    
    This message was sent from the HaulMate WA website.
  `;

  try {
    const client = getTransporter();
    const info = await client.sendMail({
      from: SMTP_FROM,
      to: ADMIN_EMAIL,
      subject: subject,
      html: html,
      text: text,
      replyTo: data.email && data.email.trim() && data.email !== "unknown@example.com" ? data.email : undefined,
    });

    if (process.env.NODE_ENV !== "production") {
      console.log(`[SMTP Mailer] Contact email successfully sent: ${info.messageId}`);
    }
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error("[SMTP Mailer] Failed to send Contact email via SMTP:", error.message || error);
    return { success: false, error: error.message || "Unknown error" };
  }
}
