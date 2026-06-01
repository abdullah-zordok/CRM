import { MarketingLayout } from "../../features/marketing/components/marketing-layout";

export default function AboutPage() {
  return (
    <MarketingLayout>
      <section className="page-hero page-hero--compact">
        <p className="eyebrow">Product vision</p>
        <h1>A quieter operating system for sales teams</h1>
        <p>
          Sales Operations CRM is designed for companies that need accountability, visibility, and
          measurable field sales behavior without burying teams in noisy tools.
        </p>
      </section>
      <section className="content-band">
        <div>
          <p className="eyebrow">Mission</p>
          <h2>Make sales work traceable and practical</h2>
          <p>
            The platform direction starts with secure lead tracking and expands toward activities,
            exhibitions, deals, targets, analytics, and notifications as connected operational
            capabilities.
          </p>
        </div>
        <div>
          <p className="eyebrow">Platform philosophy</p>
          <h2>Structure before automation</h2>
          <p>
            The first priority is reliable CRM structure: ownership, status, history, access
            control, and clear states. Automation and advanced intelligence come after the operating
            model is trustworthy.
          </p>
        </div>
      </section>
    </MarketingLayout>
  );
}
