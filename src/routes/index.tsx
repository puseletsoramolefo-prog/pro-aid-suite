import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Database,
  ListChecks,
  Sparkles,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { FEATURE_ITEMS } from "@/lib/nav";
import { RECENT_ACTIVITY } from "@/lib/mock";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Save time, stay organised and work smarter with AI email drafting, meeting summaries and task planning.",
      },
      { property: "og:title", content: "Dashboard — AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content:
          "Save time, stay organised and work smarter with AI email drafting, meeting summaries and task planning.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function Dashboard() {
  const [demo, setDemo] = useState(true);
  const [loading, setLoading] = useState(false);

  const stats = demo
    ? [
        { label: "Tasks completed", value: "27", icon: CheckCircle2, hint: "+6 this week" },
        { label: "AI tasks run", value: "142", icon: Sparkles, hint: "Across 5 modules" },
        { label: "Time saved", value: "9h 40m", icon: Clock, hint: "Estimated this month" },
        { label: "Active plans", value: "3", icon: ListChecks, hint: "1 daily · 2 weekly" },
      ]
    : [
        { label: "Tasks completed", value: "0", icon: CheckCircle2, hint: "No activity yet" },
        { label: "AI tasks run", value: "0", icon: Sparkles, hint: "No activity yet" },
        { label: "Time saved", value: "0m", icon: Clock, hint: "No activity yet" },
        { label: "Active plans", value: "0", icon: ListChecks, hint: "No activity yet" },
      ];

  const activity = demo ? RECENT_ACTIVITY : [];

  return (
    <AppShell
      title="AI Workplace Productivity Assistant"
      subtitle="Save time, stay organised and work smarter with AI-powered workplace tools."
    >
      <Card>
        <CardHeader className="flex-row items-center justify-between gap-4 space-y-0">
          <div>
            <CardTitle className="text-base">Load sample demo data</CardTitle>
            <CardDescription>
              Fills metrics and the activity feed with realistic examples for presentations.
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <Database className="hidden size-4 text-muted-foreground sm:block" />
            <Switch
              checked={demo}
              aria-label="Load sample demo data"
              onCheckedChange={(v) => {
                setLoading(true);
                setDemo(v);
                setTimeout(() => {
                  setLoading(false);
                  toast.success(v ? "Sample demo data loaded" : "Workspace cleared");
                }, 500);
              }}
            />
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <s.icon className="size-4 text-primary" />
              </div>
              {loading ? (
                <Skeleton className="mt-3 h-8 w-20" />
              ) : (
                <p className="mt-2 font-display text-3xl font-semibold">{s.value}</p>
              )}
              <p className="mt-1 text-xs text-muted-foreground">{s.hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">AI modules</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {FEATURE_ITEMS.map((f) => (
            <Card key={f.to} className="group transition-shadow hover:shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <f.icon className="size-5" />
                  </div>
                  {f.badge ? <Badge variant="secondary">{f.badge}</Badge> : null}
                </div>
                <CardTitle className="mt-3 text-base">{f.label}</CardTitle>
                <CardDescription>{f.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full justify-between">
                  <Link to={f.to}>
                    Launch
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Zap className="size-4 text-primary" /> Quick actions
            </CardTitle>
            <CardDescription>One click into the most common workflows.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button asChild variant="secondary" className="justify-start">
              <Link to="/email">Write an Email</Link>
            </Button>
            <Button asChild variant="secondary" className="justify-start">
              <Link to="/meetings">Summarize Meeting</Link>
            </Button>
            <Button asChild variant="secondary" className="justify-start">
              <Link to="/planner">Plan My Tasks</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Recent activity</CardTitle>
            <CardDescription>What you and the assistant have been working on.</CardDescription>
          </CardHeader>
          <CardContent>
            {activity.length === 0 ? (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <p className="text-sm font-medium">Nothing here yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Turn on sample demo data above, or run any module to start your history.
                </p>
              </div>
            ) : (
              <ul className="divide-y">
                {activity.map((a) => (
                  <li key={a.id} className="flex items-center justify-between gap-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{a.label}</p>
                      <p className="text-xs text-muted-foreground">{a.module}</p>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">{a.when}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
