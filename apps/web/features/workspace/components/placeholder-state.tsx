import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { LayoutDashboard } from "lucide-react";

interface PlaceholderStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
}

export function PlaceholderState({ title, description, icon: Icon = LayoutDashboard }: PlaceholderStateProps) {
  return (
    <section className="placeholder-panel" aria-labelledby="placeholder-title">
      <div className="placeholder-panel__icon" aria-hidden="true">
        <Icon size={28} />
      </div>
      <div>
        <p className="eyebrow">Not available in this phase</p>
        <h1 id="placeholder-title">{title}</h1>
        <p>{description}</p>
        <p className="muted-text">
          This page is prepared for future CRM work and does not expose live business records or
          unfinished actions.
        </p>
        <Link className="button button--secondary" href="/dashboard">
          Back to dashboard
        </Link>
      </div>
    </section>
  );
}
