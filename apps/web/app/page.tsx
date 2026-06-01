import Link from "next/link";
import {
  analyticsPreview,
  dashboardMetrics,
  featureChartPoints,
  featureHighlights,
  insightIcon,
  lifecycleSteps,
  productFeatures,
  productPrinciples,
} from "../features/marketing/content/product-content";
import { MarketingLayout } from "../features/marketing/components/marketing-layout";

export default function HomePage() {
  const InsightIcon = insightIcon;

  return (
    <MarketingLayout>
      <section className="hero-section">
        <div className="hero-section__copy">
          <p className="eyebrow">Sales Operations CRM</p>
          <h1>Lead tracking and sales visibility for field teams</h1>
          <p>
            A secure CRM workspace for exhibition companies, sales managers, and field
            representatives who need accountable lead ownership and performance visibility.
          </p>
          <div className="button-row">
            <Link className="button button--primary" href="/contact">
              Contact Sales
            </Link>
            <Link className="button button--secondary" href="/login">
              Sign in
            </Link>
          </div>
        </div>
        <div className="dashboard-preview" aria-label="Dashboard preview">
          <div className="dashboard-preview__header">
            <span>Pipeline overview</span>
            <InsightIcon size={20} aria-hidden="true" />
          </div>
          <div className="metric-grid">
            {dashboardMetrics.map((metric) => (
              <div className="metric-tile" key={metric.label}>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </div>
            ))}
          </div>
          <div className="chart-strip" aria-hidden="true">
            {featureChartPoints.map((point, index) => (
              <span key={index} style={{ blockSize: `${point}%` }} />
            ))}
          </div>
        </div>
      </section>

      <section className="content-band">
        <div>
          <p className="eyebrow">Problem</p>
          <h2>Sales work gets lost between events, teams, and spreadsheets</h2>
          <p>
            Growing teams need clear ownership, status, and follow-up visibility before they can
            trust forecasts, analytics, or automation.
          </p>
        </div>
        <div>
          <p className="eyebrow">Solution</p>
          <h2>A focused operating surface for CRM accountability</h2>
          <p>
            The platform starts with secure lead tracking and expands through activities,
            exhibitions, deals, targets, analytics, and notifications.
          </p>
        </div>
      </section>

      <section className="section-grid" aria-label="Product principles">
        {productPrinciples.map((item) => (
          <article className="feature-card" key={item.title}>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
          </article>
        ))}
      </section>

      <section className="feature-overview">
        <div>
          <p className="eyebrow">Feature areas</p>
          <h2>Prepared for the sales lifecycle</h2>
        </div>
        <div className="feature-list">
          {productFeatures.slice(0, 4).map((feature) => {
            const Icon = feature.icon;
            return (
              <article key={feature.title}>
                <Icon size={22} aria-hidden="true" />
                <div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="lifecycle-section" aria-label="Lead lifecycle flow">
        <p className="eyebrow">Lead lifecycle</p>
        <ol>
          {lifecycleSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section className="section-grid" aria-label="Dashboard preview details">
        {analyticsPreview.map((item) => (
          <article className="feature-card" key={item.label}>
            <strong className="metric-value">{item.value}</strong>
            <h2>{item.label}</h2>
            <p>{item.trend}</p>
          </article>
        ))}
      </section>

      <section className="cta-band">
        <div>
          <p className="eyebrow">Ready to review the workflow?</p>
          <h2>Start with a sales operations conversation</h2>
        </div>
        <Link className="button button--primary" href="/contact">
          Contact Sales
        </Link>
      </section>

      <section className="section-grid" aria-label="Product highlights">
        {featureHighlights.map((item) => (
          <article className="feature-card" key={item.title}>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
          </article>
        ))}
      </section>
    </MarketingLayout>
  );
}
