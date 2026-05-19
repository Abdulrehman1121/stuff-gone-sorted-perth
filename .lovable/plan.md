
# Booking System for Stuff Gone Sorted

A complete booking workflow with database, admin dashboard, and email notifications. Here is what I will build.

## 1. Backend (Lovable Cloud)

Enable Lovable Cloud for database, auth, file storage, and server functions.

**Database tables:**
- `bookings` — all booking fields (customer, service, schedule, status, approved date/time, admin notes, photo URL)
- `profiles` + `user_roles` (with `admin` role) — secure role-based admin access (roles in a separate table to prevent privilege escalation)

**Storage:** `booking-photos` bucket for customer-uploaded images.

**Status enum:** `pending_approval`, `approved`, `rejected`, `completed`, `cancelled`. New submissions are always `pending_approval` — never auto-approved.

## 2. Public booking page

- New route `/book` with the full booking form (all fields you listed: customer details, service dropdown, load size, photo upload, access notes, preferred + alternative date/time, urgency)
- Validated with zod + react-hook-form (name, email, phone, suburb, service, date, time all required)
- Animated multi-section layout matching the navy/yellow/white brand
- Success screen: "Thanks! Your booking request has been received. We'll review your details and confirm by email or phone shortly."

## 3. Site integration

- Hero: add **Book Now** button next to Call/Quote/WhatsApp
- Nav: add **Book a Service** link
- Mobile sticky bar: add **Book Now** alongside Call
- CTA copy sprinkled in ("Book your rubbish removal in Perth", "Choose your preferred date and time", etc.)

## 4. Admin dashboard

- Route `/admin` protected by `_authenticated` layout + admin role check
- Login page `/admin/login` (email + password)
- Dashboard tabs: **List view** and **Calendar view** (approved bookings grouped by date)
- Per-booking actions: Approve (with optional edit of approved date/time before approving), Reject, Mark Completed, Cancel, add admin notes
- Filters by status

## 5. Emails

Use Lovable's built-in email system (requires a sender domain — I will prompt you to set it up).

- **On submission** → email to `abdulrehmankaleem195@gmail.com` with full booking details + link to admin dashboard. Subject: "New Booking Request - Stuff Gone Sorted"
- **On approval** → email to customer with approved date/time and booking summary. Subject: "Your Booking Has Been Approved - Stuff Gone Sorted"
- **On rejection** → polite email asking customer to call 0415 125 702

## 6. Security

- RLS on `bookings`: public can INSERT; only admins can SELECT/UPDATE
- Admin role checked via `has_role()` security-definer function (no recursive RLS)
- Photo uploads validated for type/size
- Server-side validation on the submit server function

## Technical notes

- Stack: TanStack Start server functions + Supabase (Lovable Cloud)
- Email: Lovable Emails (built-in) — needs a sender domain set up first
- Roles stored in separate `user_roles` table per security best practice
- Admin account: I'll create the first admin user via SQL after you set a password

## Things you will need to do

1. Confirm and I'll enable Lovable Cloud
2. Set up a sender email domain (one-click dialog) so emails can actually send
3. Provide a password for the admin login (I'll prompt securely) — your admin email will be `abdulrehmankaleem195@gmail.com`

Approve and I'll build it.
