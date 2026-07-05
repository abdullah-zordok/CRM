import Link from "next/link";
import { ArrowLeft, BarChart3, CalendarClock, Headphones, Info } from "lucide-react";

export default function RegisterPage() {
  return (
    <main className="registration-coming-soon" id="main-content">
      <div className="registration-coming-soon__dots registration-coming-soon__dots--start" />
      <div className="registration-coming-soon__dots registration-coming-soon__dots--end" />
      <section className="registration-coming-soon__card" aria-labelledby="registration-title">
        <Link className="registration-coming-soon__brand" href="/" aria-label="SalesCRM home">
          <span aria-hidden="true">
            <BarChart3 size={30} />
          </span>
          <b>
            Sales<span>CRM</span>
          </b>
        </Link>
        <div className="registration-coming-soon__hero-icon" aria-hidden="true">
          <CalendarClock size={76} strokeWidth={1.8} />
        </div>
        <p className="registration-coming-soon__badge">Coming soon</p>
        <h1 id="registration-title">Registration is not available yet</h1>
        <p className="registration-coming-soon__description">
          We&apos;re putting the finishing touches on account creation. New registration will be
          available soon.
        </p>
        <div className="registration-coming-soon__info">
          <Info size={30} aria-hidden="true" />
          <p>For now, account access is created and managed by the CRM administration team.</p>
        </div>
        <div className="registration-coming-soon__actions">
          <Link
            className="registration-coming-soon__button registration-coming-soon__button--secondary"
            href="/contact"
          >
            <Headphones size={20} aria-hidden="true" />
            Contact Sales
          </Link>
          <Link
            className="registration-coming-soon__button registration-coming-soon__button--primary"
            href="/login"
          >
            <ArrowLeft size={20} aria-hidden="true" />
            Back to sign in
          </Link>
        </div>
      </section>
    </main>
  );
}
