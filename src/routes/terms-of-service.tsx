import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";

export const Route = createFileRoute("/terms-of-service")({
  component: TermsOfServicePage,
});

function TermsOfServicePage() {
  return (
    <div className="bg-background text-foreground flex flex-col">
      <main className="flex-1 py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="prose prose-slate max-w-none prose-headings:font-display prose-headings:text-navy prose-a:text-yellow-foreground"
          >
            <h1 className="text-4xl sm:text-5xl font-display text-navy mb-8">Terms of Service</h1>
            <p className="text-sm text-slate-500 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>
            
            <p>
              Welcome to HaulMate WA. By accessing our website and booking our services, you agree to be bound by the following Terms of Service.
            </p>

            <h2>1. Service Description</h2>
            <p>
              HaulMate WA provides rubbish removal, furniture disposal, and general hauling services across the Perth Metropolitan area. 
              We reserve the right to refuse service for hazardous materials or situations that pose a safety risk to our team.
            </p>

            <h2>2. Booking and Quotes</h2>
            <p>
              All online bookings are considered <strong>Pending Approval</strong> until explicitly confirmed by our administrative team. 
              Quotes provided online or via phone are estimates based on the information provided by the customer. The final price may be adjusted upon visual inspection on-site if the volume or type of rubbish differs from the original description.
            </p>

            <h2>3. Cancellations</h2>
            <p>
              If you need to cancel or reschedule your booking, please provide at least 24 hours notice by calling us at 0415 125 702.
            </p>

            <h2>4. Liability</h2>
            <p>
              While our team takes the utmost care when operating on your property, HaulMate WA is not liable for incidental damage caused during the normal course of rubbish removal, unless resulting from gross negligence.
            </p>

            <h2>5. Contact</h2>
            <p>
              For any questions regarding these terms, please call 0415 125 702.
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
