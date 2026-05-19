import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";

export const Route = createFileRoute("/privacy-policy")({
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
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
            <h1 className="text-4xl sm:text-5xl font-display text-navy mb-8">Privacy Policy</h1>
            <p className="text-sm text-slate-500 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>
            
            <p>
              At HaulMate WA, we respect your privacy and are committed to protecting your personal data. 
              This privacy policy explains how we collect, use, and share your personal information when you use our website or services.
            </p>

            <h2>1. Information We Collect</h2>
            <p>
              When you request a quote or book our services, we may collect the following information:
            </p>
            <ul>
              <li><strong>Personal details:</strong> Your name, email address, and phone number.</li>
              <li><strong>Location details:</strong> Your suburb and street address for service delivery.</li>
              <li><strong>Job details:</strong> Descriptions and photos of the items you wish to have removed.</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>
              We use the collected information for the following purposes:
            </p>
            <ul>
              <li>To provide you with accurate quotes for our rubbish removal services.</li>
              <li>To schedule and execute bookings.</li>
              <li>To communicate with you regarding your service request, including sending confirmation emails.</li>
              <li>To improve our website and customer service.</li>
            </ul>

            <h2>3. Data Security</h2>
            <p>
              We have implemented appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way.
            </p>

            <h2>4. Contact Us</h2>
            <p>
              If you have any questions about this privacy policy, please contact us at: <br/>
              <strong>Phone:</strong> 0415 125 702
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
