import {
  Bot,
  CalendarClock,
  LayoutDashboard,
  Mail,
  NotebookPen,
  Search,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  to: "/" | "/email" | "/meetings" | "/planner" | "/research" | "/chat" | "/settings";
  label: string;
  icon: LucideIcon;
  badge?: string;
  description: string;
};

export const NAV_ITEMS: NavItem[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, description: "Your day at a glance" },
  {
    to: "/email",
    label: "Smart Email Generator",
    icon: Mail,
    badge: "Popular",
    description: "Turn rough notes into a polished, on-tone email in seconds.",
  },
  {
    to: "/meetings",
    label: "Meeting Notes Summarizer",
    icon: NotebookPen,
    badge: "Structured",
    description: "Executive summary, decisions and an action-item table from raw notes.",
  },
  {
    to: "/planner",
    label: "AI Task Planner",
    icon: CalendarClock,
    badge: "Scheduling",
    description: "Prioritise, sequence and time-box your tasks with realistic breaks.",
  },
  {
    to: "/research",
    label: "AI Research Assistant",
    icon: Search,
    badge: "Verify sources",
    description: "Balanced overviews, trade-offs and practical next steps on any work topic.",
  },
  {
    to: "/chat",
    label: "AI Workplace Chat",
    icon: Bot,
    badge: "Chat",
    description: "Ask anything workplace-related and iterate on drafts conversationally.",
  },
  { to: "/settings", label: "Settings", icon: Settings, description: "Profile, model and privacy" },
];

export const FEATURE_ITEMS = NAV_ITEMS.filter((n) => n.to !== "/" && n.to !== "/settings");
