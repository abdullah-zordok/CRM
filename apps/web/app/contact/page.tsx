import { ContactSalesForm } from "../../features/marketing/components/contact-sales-form";
import { MarketingLayout } from "../../features/marketing/components/marketing-layout";

export default function ContactPage() {
  return (
    <MarketingLayout>
      <section className="page-hero page-hero--compact">
        <p className="eyebrow">Contact Sales</p>
        <h1>Talk through your sales operations workflow</h1>
        <p>
          Share basic details about your company and sales process. This phase validates the form
          locally and does not create a CRM record.
        </p>
      </section>
      <section className="form-section" aria-label="Contact sales form">
        <ContactSalesForm />
      </section>
    </MarketingLayout>
  );
}
