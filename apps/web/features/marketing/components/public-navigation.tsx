import Link from "next/link";
import { publicNavigation } from "../content/product-content";

export function PublicNavigation() {
  return (
    <nav className="public-nav" aria-label="Public navigation">
      <Link className="brand-mark" href="/" aria-label="Sales Operations CRM home">
        <span className="brand-symbol" aria-hidden="true">
          SO
        </span>
        <span>Sales Operations CRM</span>
      </Link>
      <div className="public-nav__links">
        {publicNavigation.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </div>
      <Link className="button button--primary" href="/contact">
        Contact Sales
      </Link>
    </nav>
  );
}
