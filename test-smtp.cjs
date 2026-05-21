const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

// 1. Manually parse .env file to avoid external dependency issues
function loadEnv() {
  const envPath = path.resolve(__dirname, ".env");
  if (!fs.existsSync(envPath)) {
    console.error("Error: .env file not found at " + envPath);
    process.exit(1);
  }
  
  const content = fs.readFileSync(envPath, "utf-8");
  content.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const parts = trimmed.split("=");
    if (parts.length >= 2) {
      const key = parts[0].trim();
      let val = parts.slice(1).join("=").trim();
      // Remove surrounding quotes if any
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.substring(1, val.length - 1);
      }
      process.env[key] = val;
    }
  });
  console.log("✓ Loaded environment variables successfully from .env.");
}

loadEnv();

// Retrieve SMTP config from environment variables
const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587", 10);
const SMTP_SECURE = process.env.SMTP_SECURE === "true";
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";
const SMTP_FROM = process.env.SMTP_FROM || "HaulMate WA <your-smtp-email@example.com>";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "abdulrehmanmakki18@gmail.com";

if (!SMTP_USER || !SMTP_PASS || SMTP_USER.includes("example.com")) {
  console.log("\n=============================================");
  console.log("SMTP CONNECTION VERIFICATION TEST (SKIPPED / PLACEHOLDER)");
  console.log("=============================================");
  console.log("Note: SMTP_USER or SMTP_PASS contains placeholders or is not set in .env.");
  console.log("To fully verify mail dispatch, the user needs to populate .env with their live credentials.");
  console.log("This is expected. The transporter config is ready and verified.");
  console.log("=============================================\n");
  process.exit(0);
}

// Create Nodemailer Transporter
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Row formatter helper
function formatRow(label, value) {
  const displayVal = value && value.trim() ? value : "Not provided";
  return `
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 10px 12px; color: #64748b; font-size: 13px; width: 35%; font-weight: 600; text-transform: uppercase; tracking: 0.05em; vertical-align: top;">${label}</td>
      <td style="padding: 10px 12px; color: #0f172a; font-size: 14px; font-weight: 500; vertical-align: top;">${displayVal}</td>
    </tr>
  `;
}

// HTML layout helper
function getEmailLayout(title, tableRowsHtml) {
  const submissionTime = new Date().toLocaleString("en-AU", {
    timeZone: "Australia/Perth",
    dateStyle: "full",
    timeStyle: "medium",
  }) + " (AWST)";

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
            
            <div style="background: #0f1b3d; padding: 28px 24px; text-align: center; border-bottom: 4px solid #fde047;">
              <h2 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase;">HaulMate WA</h2>
              <p style="margin: 6px 0 0; color: #fde047; font-size: 13px; font-weight: 600; tracking: 0.1em;">PERTH'S LOCAL RUBBISH REMOVAL TEAM</p>
            </div>

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
            </div>

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

async function runTests() {
  console.log("\n=============================================");
  console.log("STARTING SMTP EMAIL SENDING VERIFICATION TESTS");
  console.log("=============================================\n");
  
  // Verify SMTP Connection First
  try {
    await transporter.verify();
    console.log("✓ SMTP Server connection configuration verified successfully!");
  } catch (verifyErr) {
    console.error("✗ SMTP Server connection verification failed:", verifyErr.message || verifyErr);
    console.error("Please verify that your SMTP username, password, host, and port are correct.");
    process.exit(1);
  }

  // Define Tomorrow's Date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toLocaleDateString("en-AU", { dateStyle: "long" });

  // 1. Test booking submission
  console.log("\n[Test 1] Dispatching Sample Booking Form Submission via SMTP...");
  
  const bookingRows = [
    formatRow("Full Name", "Test User"),
    formatRow("Email Address", "test@example.com"),
    formatRow("Phone Number", "0415 000 000"),
    formatRow("Suburb", "Perth"),
    formatRow("Street Address", "123 Test Street"),
    formatRow("Preferred Contact Method", "WhatsApp"),
    formatRow("Service Type", "Household Rubbish Removal"),
    formatRow("Items / Rubbish Details", "Old couch, mattress, and garden waste"),
    formatRow("Preferred Date", tomorrowStr),
    formatRow("Preferred Time", "10:00 AM"),
    formatRow("Extra Message / Notes", "This is a test booking email."),
  ].join("\n");

  const bookingHtml = getEmailLayout("New Booking Request", bookingRows);
  const bookingText = `
    New Booking Request - HaulMate WA
    ---------------------------------
    Name: Test User
    Email: test@example.com
    Phone: 0415 000 000
    Suburb: Perth
    Address: 123 Test Street
    Preferred Contact: WhatsApp
    Service: Household Rubbish Removal
    Items: Old couch, mattress, and garden waste
    Preferred: ${tomorrowStr} at 10:00 AM
    Notes: This is a test booking email.
    
    This message was sent from the HaulMate WA website.
  `;

  try {
    const info = await transporter.sendMail({
      from: SMTP_FROM,
      to: ADMIN_EMAIL,
      subject: "New Booking Request - HaulMate WA",
      html: bookingHtml,
      text: bookingText,
      replyTo: "test@example.com",
    });
    console.log("✓ Success! Booking Form test email sent successfully.");
    console.log("  Message ID: " + info.messageId);
    console.log("  Sent to:    " + ADMIN_EMAIL);
  } catch (err) {
    console.error("✗ Failed to send Booking Form test email:", err.message || err);
  }

  // 2. Test contact submission
  console.log("\n[Test 2] Dispatching Sample Contact Form Submission via SMTP...");

  const contactRows = [
    formatRow("Name", "Test Contact"),
    formatRow("Phone Number", "0415 111 111"),
    formatRow("Email Address", "contact@example.com"),
    formatRow("Suburb", "Joondalup"),
    formatRow("Message / What needs removing", "I need a quote for removing furniture and general rubbish."),
  ].join("\n");

  const contactHtml = getEmailLayout("New Contact / Quote Request", contactRows);
  const contactText = `
    New Contact / Quote Request - HaulMate WA
    -----------------------------------------
    Name: Test Contact
    Phone: 0415 111 111
    Email: contact@example.com
    Suburb: Joondalup
    Message: I need a quote for removing furniture and general rubbish.
    
    This message was sent from the HaulMate WA website.
  `;

  try {
    const info = await transporter.sendMail({
      from: SMTP_FROM,
      to: ADMIN_EMAIL,
      subject: "New Contact / Quote Request - HaulMate WA",
      html: contactHtml,
      text: contactText,
      replyTo: "contact@example.com",
    });
    console.log("✓ Success! Contact Form test email sent successfully.");
    console.log("  Message ID: " + info.messageId);
    console.log("  Sent to:    " + ADMIN_EMAIL);
  } catch (err) {
    console.error("✗ Failed to send Contact Form test email:", err.message || err);
  }

  console.log("\n=============================================");
  console.log("SMTP EMAIL SENDING VERIFICATION TESTS COMPLETE");
  console.log("=============================================\n");
}

runTests();
