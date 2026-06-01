import type { ReactNode } from "react";
import { PublicNavigation } from "./public-navigation";

interface MarketingLayoutProps {
  children: ReactNode;
}

export function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <PublicNavigation />
      <main id="main-content">{children}</main>
    </div>
  );
}
