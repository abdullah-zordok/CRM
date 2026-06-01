import {
  BarChart3,
  Bell,
  CalendarClock,
  ContactRound,
  Handshake,
  LayoutDashboard,
  Settings,
  Target,
  Tent,
  Users,
  type LucideIcon,
} from "lucide-react";

export type WorkspaceDestinationState = "working" | "placeholder";

export interface WorkspaceDestination {
  label: string;
  href: string;
  state: WorkspaceDestinationState;
  description: string;
  icon: LucideIcon;
}

export const workspaceDestinations: WorkspaceDestination[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    state: "placeholder",
    description: "Workspace overview for future operational summaries.",
    icon: LayoutDashboard,
  },
  {
    label: "Leads",
    href: "/leads",
    state: "working",
    description: "Existing lead management surface.",
    icon: ContactRound,
  },
  {
    label: "Activities",
    href: "/activities",
    state: "placeholder",
    description: "Future timeline and follow-up activity area.",
    icon: CalendarClock,
  },
  {
    label: "Exhibitions",
    href: "/exhibitions",
    state: "placeholder",
    description: "Future exhibition management area.",
    icon: Tent,
  },
  {
    label: "Deals",
    href: "/deals",
    state: "placeholder",
    description: "Future deals and revenue tracking area.",
    icon: Handshake,
  },
  {
    label: "Targets",
    href: "/targets",
    state: "placeholder",
    description: "Future target and commission tracking area.",
    icon: Target,
  },
  {
    label: "Analytics",
    href: "/analytics",
    state: "placeholder",
    description: "Future sales performance analytics area.",
    icon: BarChart3,
  },
  {
    label: "Notifications",
    href: "/notifications",
    state: "placeholder",
    description: "Future operational notification area.",
    icon: Bell,
  },
  {
    label: "Team",
    href: "/team",
    state: "working",
    description: "Existing team management behavior is preserved.",
    icon: Users,
  },
  {
    label: "Users",
    href: "/users",
    state: "working",
    description: "Existing user administration behavior is preserved.",
    icon: Users,
  },
  {
    label: "Settings",
    href: "/settings",
    state: "placeholder",
    description: "Future workspace settings area.",
    icon: Settings,
  },
];

export function getWorkspaceDestination(label: string) {
  return workspaceDestinations.find(
    (destination) => destination.label.toLowerCase() === label.toLowerCase(),
  );
}

export function isPreservedWorkingDestination(href: string) {
  return workspaceDestinations.some(
    (destination) => destination.href === href && destination.state === "working",
  );
}
