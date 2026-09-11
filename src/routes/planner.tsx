import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, CalendarClock, Lightbulb, Plus, Sparkles, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SYSTEM, askJson } from "@/lib/ai";
import {
  SAMPLE_TASKS,
  mockPlan,
  type PlanResult,
  type PlannerTask,
  type Priority,
} from "@/lib/mock";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Workplace AI" },
      {
        name: "description",
        content:
          "Prioritise tasks, generate a realistic daily or weekly schedule with breaks, and catch workload conflicts early.",
      },
      { property: "og:title", content: "AI Task Planner — Workplace AI" },
      {
        property: "og:description",
        content: "Prioritise tasks and generate a realistic daily or weekly schedule with breaks.",
      },
    ],
  }),
  component: PlannerPage,
});

const PRIORITIES: Priority[] = ["High", "Medium", "Low"];

function isPlan(v: unknown): v is PlanResult {
  const p = v as PlanResult;
  return !!p && Array.isArray(p.schedule) && Array.isArray(p.recommendations);
}

function PlannerPage() {
  const [tasks, setTasks] = useState<PlannerTask[]>(SAMPLE_TASKS);
  const [scope, setScope] = useState<"Daily" | "Weekly">("Daily");
  const [name, setName] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [deadline, setDeadline] = useState("Today");
  const [minutes, setMinutes] = useState("30");
  const [plan, setPlan] = useState<PlanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<"cloud" | "demo">("demo");

  function addTask() {
    if (!name.trim()) {
      toast.error("Give the task a name.");
      return;
    }
    setTasks([
      ...tasks,
      {
        id: crypto.randomUUID(),
        name: name.trim(),
        priority,
        deadline: deadline.trim() || "Not specified",
        minutes: Math.max(5, Number(minutes) || 30),
      },
    ]);
    setName("");
    setMinutes("30");
    toast.success("Task added");
  }

  async function generate() {
    if (!tasks.length) {
      toast.error("Add at least one task.");
      return;
    }
    setLoading(true);
    const result = await askJson<PlanResult>({
      system: SYSTEM.planner,
      prompt: `Build a ${scope === "Daily" ? "daily schedule" : "weekly plan"} starting at 09:00 for these tasks:
${tasks.map((t) => `- ${t.name} | priority ${t.priority} | due ${t.deadline} | ${t.minutes} minutes`).join("\n")}

Include realistic breaks. Return JSON: {"ranking":[{"name":string,"reason":string}],"schedule":[{"time":string,"item":string,"kind":"task"|"break"}],"warnings":string[],"recommendations":string[]}`,
      fallback: () => mockPlan(tasks, scope),
      validate: isPlan,
    });
    setPlan(result.data);
    setSource(result.source);
    setLoading(false);
    toast.success("Schedule generated");
  }

  const totalMinutes = tasks.reduce((s, t) => s + t.minutes, 0);

  return (
    <AppShell
      title="AI Task Planner"
      subtitle="Add what's on your plate and get a prioritised, time-boxed plan with breaks, conflict warnings and productivity advice."
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex-row items-center justify-between gap-3 space-y-0">
              <div>
                <CardTitle className="text-base">Your tasks</CardTitle>
                <CardDescription>
                  {tasks.length} tasks · {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m total
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setTasks(SAMPLE_TASKS)}>
                Reset samples
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {tasks.length === 0 ? (
                <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                  No tasks yet. Add one below or reset to the sample list.
                </div>
              ) : (
                tasks.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center gap-3 rounded-lg border bg-card p-3 text-sm"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{t.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Due {t.deadline} · {t.minutes} min
                      </p>
                    </div>
                    <Badge
                      variant={
                        t.priority === "High"
                          ? "destructive"
                          : t.priority === "Medium"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {t.priority}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Remove ${t.name}`}
                      onClick={() => setTasks(tasks.filter((x) => x.id !== t.id))}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Add a task</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="task-name">Task name</Label>
                <Input
                  id="task-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Draft board pack"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORITIES.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="task-deadline">Deadline</Label>
                  <Input
                    id="task-deadline"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    placeholder="Today"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="task-mins">Duration (min)</Label>
                  <Input
                    id="task-mins"
                    type="number"
                    min={5}
                    step={5}
                    value={minutes}
                    onChange={(e) => setMinutes(e.target.value)}
                  />
                </div>
              </div>
              <Button variant="outline" onClick={addTask} className="gap-2">
                <Plus className="size-4" /> Add task
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Plan scope</CardTitle>
              <CardDescription>Choose how far ahead the assistant should plan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs value={scope} onValueChange={(v) => setScope(v as "Daily" | "Weekly")}>
                <TabsList>
                  <TabsTrigger value="Daily">Daily schedule</TabsTrigger>
                  <TabsTrigger value="Weekly">Weekly plan</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button onClick={generate} disabled={loading} className="gap-2">
                <Sparkles className="size-4" />
                {loading ? "Planning…" : "Generate AI schedule & plan"}
              </Button>
            </CardContent>
          </Card>

          {loading ? (
            <Skeleton className="h-96 w-full" />
          ) : !plan ? (
            <Card>
              <CardContent className="py-12 text-center">
                <CalendarClock className="mx-auto size-6 text-muted-foreground" />
                <p className="mt-3 text-sm font-medium">No plan yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Generate a schedule to see priority ranking, timings, warnings and advice.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <Badge variant={source === "cloud" ? "default" : "secondary"}>
                {source === "cloud" ? "AI generated" : "Demo mode"}
              </Badge>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Priority ranking & order of execution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3">
                    {plan.ranking.map((r, i) => (
                      <li key={i} className="flex gap-3 text-sm">
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                          {i + 1}
                        </span>
                        <div>
                          <p className="font-medium">{r.name}</p>
                          <p className="text-muted-foreground">{r.reason}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Suggested timeline</CardTitle>
                  <CardDescription>Breaks included — they are part of the plan.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.schedule.map((s, i) => (
                      <li
                        key={i}
                        className={`flex flex-wrap items-center gap-3 rounded-lg border p-3 text-sm ${
                          s.kind === "break" ? "border-dashed bg-muted/50" : "bg-card"
                        }`}
                      >
                        <span className="font-mono text-xs text-muted-foreground">{s.time}</span>
                        <span className={s.kind === "break" ? "text-muted-foreground" : "font-medium"}>
                          {s.item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <AlertTriangle className="size-4 text-warning" /> Conflicts & workload warnings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc space-y-2 pl-5 text-sm">
                    {plan.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Lightbulb className="size-4 text-primary" /> Productivity recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc space-y-2 pl-5 text-sm">
                    {plan.recommendations.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
