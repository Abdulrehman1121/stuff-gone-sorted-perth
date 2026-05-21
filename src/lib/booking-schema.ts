import { z } from "zod";

export const SERVICE_TYPES = [
  "Household item removal",
  "Furniture removal",
  "Garden waste removal",
  "Rubbish removal",
  "Garage cleanout",
  "Small moving / hauling job",
  "Other",
] as const;

export const LOAD_SIZES = [
  "Small load",
  "Half UTE load",
  "Full UTE load",
  "Not sure",
] as const;

export const URGENCIES = ["Today", "Tomorrow", "This week", "Flexible"] as const;
export const CONTACT_METHODS = ["Call", "WhatsApp", "Email"] as const;

const isTimeWithinBounds = (val?: string) => {
  if (!val) return true;
  const parts = val.split(":");
  if (parts.length < 2) return false;
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  const totalMinutes = hours * 60 + minutes;
  // 6am is 6 * 60 = 360
  // 6pm is 18 * 60 = 1080
  return totalMinutes >= 360 && totalMinutes <= 1080;
};

export const bookingInputSchema = z.object({
  full_name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("Valid email required").max(200),
  phone: z.string().trim().min(6, "Phone is required").max(40),
  suburb: z.string().trim().min(1, "Suburb is required").max(120),
  street_address: z.string().trim().max(240).optional().or(z.literal("")),
  contact_method: z.enum(CONTACT_METHODS),
  service_type: z.enum(SERVICE_TYPES),
  item_description: z.string().trim().max(2000).optional().or(z.literal("")),
  load_size: z.enum(LOAD_SIZES).optional(),
  access_notes: z.string().trim().max(1000).optional().or(z.literal("")),
  photo_url: z.string().url().max(500).optional().or(z.literal("")),
  preferred_date: z.string().min(1, "Preferred date is required"),
  preferred_time: z.string().min(1, "Preferred time is required").refine(
    (val) => isTimeWithinBounds(val),
    { message: "Please choose a booking time between 6:00 AM and 6:00 PM." }
  ),
  alternative_date: z.string().optional().or(z.literal("")),
  alternative_time: z.string().optional().or(z.literal("")).refine(
    (val) => !val || isTimeWithinBounds(val),
    { message: "Please choose a booking time between 6:00 AM and 6:00 PM." }
  ),
  urgency: z.enum(URGENCIES).optional(),
});

export type BookingInput = z.infer<typeof bookingInputSchema>;
