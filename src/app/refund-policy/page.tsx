import { LegalShell } from "@/components/site";

export default function RefundPolicy() {
  return (
    <LegalShell title="Refund Policy" updated="Last updated: May 2, 2026">

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">1. Eligibility for Refunds</h2>
        <p className="text-gray-700">
          You may request a refund within 14 days of your purchase, provided that the service has not been fully delivered or consumed.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">2. Non-Refundable Services</h2>
        <p className="text-gray-700">
          Services that have already been fully rendered, including completed accounting reports, finalized business creation files, or delivered advisory sessions, are not eligible for a refund.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">3. How to Request a Refund</h2>
        <p className="text-gray-700">
          To request a refund, please contact us at <a href="mailto:contact@mziane.com" className="text-blue-600 underline">contact@mziane.com</a> with your order details. We will review your request and respond within 5 business days.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">4. Processing</h2>
        <p className="text-gray-700">
          Approved refunds are processed through Paddle and may take 5–10 business days to appear on your original payment method.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">5. Contact</h2>
        <p className="text-gray-700">
          For any questions about our refund policy, contact us at: <a href="mailto:contact@mziane.com" className="text-blue-600 underline">contact@mziane.com</a>
        </p>
      </section>
    </LegalShell>
  );
}
