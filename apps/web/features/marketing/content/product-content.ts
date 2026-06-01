import {
  BarChart3,
  Bell,
  CalendarClock,
  ContactRound,
  Handshake,
  Landmark,
  LineChart,
  Target,
  type LucideIcon,
} from "lucide-react";

export interface ProductFeature {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface MarketingLink {
  href: string;
  label: string;
}

export const publicNavigation: MarketingLink[] = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const productFeatures: ProductFeature[] = [
  {
    title: "Lead Tracking",
    description:
      "Capture, qualify, assign, and follow sales opportunities through a clear pipeline.",
    icon: ContactRound,
  },
  {
    title: "Activities Timeline",
    description:
      "Keep sales conversations, notes, and follow-up history visible for every account.",
    icon: CalendarClock,
  },
  {
    title: "Exhibitions",
    description: "Connect leads and teams to exhibition activity without losing field context.",
    icon: Landmark,
  },
  {
    title: "Deals & Revenue",
    description: "Track commercial progress from qualified interest through won or lost outcomes.",
    icon: Handshake,
  },
  {
    title: "Targets & Commissions",
    description: "Give managers and representatives a shared view of goals and performance.",
    icon: Target,
  },
  {
    title: "Analytics",
    description: "Prepare operational visibility for conversion, pipeline, and team performance.",
    icon: BarChart3,
  },
  {
    title: "Notifications",
    description: "Keep future sales work visible with planned reminders and operational alerts.",
    icon: Bell,
  },
];

export const lifecycleSteps = [
  "Capture",
  "Assign",
  "Contact",
  "Qualify",
  "Negotiate",
  "Win or learn",
] as const;

export const dashboardMetrics = [
  { label: "Open leads", value: "128" },
  { label: "Qualified", value: "42" },
  { label: "Active deals", value: "18" },
  { label: "Team focus", value: "7" },
] as const;

export const productPrinciples = [
  {
    title: "Accountability",
    description: "Every sales handoff should have a visible owner, status, and next step.",
  },
  {
    title: "Visibility",
    description: "Managers need a reliable operating view without interrupting sales teams.",
  },
  {
    title: "Revenue Intelligence",
    description: "Lead activity should connect naturally to pipeline and performance decisions.",
  },
  {
    title: "Performance Analytics",
    description:
      "The product direction favors measurable sales behavior over decorative dashboards.",
  },
] as const;

export const featureHighlights = [
  {
    title: "Operational clarity",
    description: "A quiet workspace for sales managers and representatives to scan what matters.",
  },
  {
    title: "CRM foundation first",
    description: "The interface prepares the routes and states future modules will plug into.",
  },
  {
    title: "Secure by default",
    description: "Public content stays separate from protected CRM surfaces and customer data.",
  },
] as const;

export const analyticsPreview = [
  { label: "Lead response", value: "2h", trend: "Median first contact" },
  { label: "Pipeline health", value: "74%", trend: "Qualified and active" },
  { label: "Target progress", value: "61%", trend: "Current period" },
] as const;

export const featureChartPoints = [34, 48, 44, 62, 71, 69, 84, 91] as const;

export const insightIcon = LineChart;
