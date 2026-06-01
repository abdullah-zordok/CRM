import { MarketingLayout } from "../../features/marketing/components/marketing-layout";
import { productFeatures } from "../../features/marketing/content/product-content";

export default function FeaturesPage() {
  return (
    <MarketingLayout>
      <section className="page-hero page-hero--compact">
        <p className="eyebrow">Platform areas</p>
        <h1>Built around operational sales visibility</h1>
        <p>
          The CRM structure prepares the core surfaces sales teams need: lead tracking, activity
          history, exhibition context, revenue visibility, targets, analytics, and notifications.
        </p>
      </section>
      <section className="section-grid" aria-label="Feature categories">
        {productFeatures.map((feature) => {
          const Icon = feature.icon;
          return (
            <article className="feature-card" key={feature.title}>
              <Icon size={24} aria-hidden="true" />
              <h2>{feature.title}</h2>
              <p>{feature.description}</p>
            </article>
          );
        })}
      </section>
    </MarketingLayout>
  );
}
