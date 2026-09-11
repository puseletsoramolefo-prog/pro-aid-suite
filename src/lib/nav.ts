import {
  CalendarClock,
  LayoutDashboard,
  Mail,
  NotebookPen,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  to: "/" | "/email" | "/meetings" | "/planner" | "/settings";
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
    badge: "Email",
    description: "Create professional workplace emails quickly with AI.",
  },
  {
    to: "/meetings",
    label: "Meeting Notes Summarizer",
    icon: NotebookPen,
    badge: "Summaries",
    description: "Turn meeting notes into clear summaries, decisions and action items.",
  },
  {
    to: "/planner",
    label: "AI Task Planner",
    icon: CalendarClock,
    badge: "Planning",
    description: "Organise tasks, set priorities and create an efficient work plan.",
  },
  { to: "/settings", label: "Settings", icon: Settings, description: "Profile, model and privacy" },
];

export const FEATURE_ITEMS = NAV_ITEMS.filter((n) => n.to !== "/" && n.to !== "/settings");
