import { createFileRoute } from "@tanstack/react-router";
import { Copy, Eraser, FileText, Sparkles, Wand2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { SYSTEM, askJson } from "@/lib/ai";
import {
  SAMPLE_MEETING_NOTES,
  mockMeetingSummary,
  type ActionItem,
  type MeetingSummary,
} from "@/lib/mock";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Workplace AI" },
      {
        name: "description",
        content:
          "Turn raw meeting notes into an executive summary, decisions, an action-item table and follow-ups.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer — Workplace AI" },
      {
        property: "og:description",
        content: "Executive summary, decisions, action items and follow-ups from raw meeting notes.",
      },
    ],
  }),
  component: MeetingsPage,
});

const STATUSES: ActionItem["status"][] = ["Not started", "In progress", "Done"];

function isSummary(v: unknown): v is MeetingSummary {
  const s = v as MeetingSummary;
  return !!s && typeof s.executiveSummary === "string" && Array.isArray(s.actionItems);
}

function MeetingsPage() {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<MeetingSummary | null>(null);
  const [source, setSource] = useState<"cloud" | "demo">("demo");

  async function summarise() {
    if (!notes.trim()) {
      toast.error("Paste some meeting notes first.");
      return;
    }
    setLoading(true);
    const result = await askJson<MeetingSummary>({
      system: SYSTEM.meeting,
      prompt: `Summarise these meeting notes.

${notes}

Return JSON: {"executiveSummary":string,"keyPoints":string[],"decisions":string[],"actionItems":[{"id":string,"task":string,"owner":string,"deadline":string,"status":"Not started"|"In progress"|"Done"}],"followUps":string[]}`,
      fallback: () => mockMeetingSummary(notes),
      validate: isSummary,
    });
    setSummary(result.data);
    setSource(result.source);
    setLoading(false);
    toast.success("Meeting summarised — verify owners and dates.");
  }

  function exportText() {
    if (!summary) return;
    const text = [
      "EXECUTIVE SUMMARY",
      summary.executiveSummary,
      "",
      "KEY DISCUSSION POINTS",
      ...summary.keyPoints.map((p) => `- ${p}`),
      "",
      "DECISIONS MADE",
      ...summary.decisions.map((d) => `- ${d}`),
      "",
      "ACTION ITEMS",
      ...summary.actionItems.map(
        (a) => `- ${a.task} | ${a.owner} | ${a.deadline} | ${a.status}`,
      ),
      "",
      "FOLLOW-UPS & NEXT STEPS",
      ...summary.followUps.map((f) => `- ${f}`),
    ].join("\n");
    navigator.clipboard.writeText(text);
    toast.success("Summary copied to clipboard");
  }

  function updateItem(id: string, patch: Partial<ActionItem>) {
    if (!summary) return;
    setSummary({
      ...summary,
      actionItems: summary.actionItems.map((a) => (a.id === id ? { ...a, ...patch } : a)),
    });
  }

  return (
    <AppShell
      title="Meeting Notes Summarizer"
      subtitle="Paste messy notes and get a structured record: summary, decisions, owners and deadlines — using only what's actually in your text."
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Raw meeting notes</CardTitle>
          <CardDescription>Bullet points, transcript fragments or full prose all work.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            rows={10}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Paste your meeting notes here…"
            aria-label="Raw meeting notes"
          />
          <div className="flex flex-wrap gap-2">
            <Button onClick={summarise} disabled={loading} className="gap-2">
              <Sparkles className="size-4" />
              {loading ? "Summarising…" : "Summarize meeting"}
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => {
                setNotes(SAMPLE_MEETING_NOTES);
                toast.success("Loaded “Q3 Strategy & Operations Sync”");
              }}
            >
              <Wand2 className="size-4" /> Load sample notes
            </Button>
            <Button
              variant="ghost"
              className="gap-2"
              onClick={() => {
                setNotes("");
                setSummary(null);
              }}
            >
              <Eraser className="size-4" /> Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      ) : !summary ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="mx-auto size-6 text-muted-foreground" />
            <p className="mt-3 text-sm font-medium">No summary yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Load the sample notes to see the full structured output.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={source === "cloud" ? "default" : "secondary"}>
              {source === "cloud" ? "AI generated" : "Demo mode"}
            </Badge>
            <Button size="sm" variant="secondary" className="gap-2" onClick={exportText}>
              <Copy className="size-4" /> Export / copy summary
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Executive summary</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                rows={5}
                value={summary.executiveSummary}
                onChange={(e) => setSummary({ ...summary, executiveSummary: e.target.value })}
                aria-label="Executive summary"
              />
            </CardContent>
          </Card>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Key discussion points</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-5 text-sm">
                  {summary.keyPoints.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Decisions made</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {summary.decisions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No explicit decisions recorded.</p>
                ) : (
                  summary.decisions.map((d, i) => (
                    <Badge key={i} className="max-w-full whitespace-normal text-left" variant="outline">
                      {d}
                    </Badge>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Action items</CardTitle>
              <CardDescription>Edit any field, or mark a task done.</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-56">Task</TableHead>
                    <TableHead className="min-w-40">Responsible person</TableHead>
                    <TableHead className="min-w-32">Deadline</TableHead>
                    <TableHead className="min-w-36">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {summary.actionItems.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell>
                        <Input
                          value={a.task}
                          onChange={(e) => updateItem(a.id, { task: e.target.value })}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={a.owner}
                          onChange={(e) => updateItem(a.id, { owner: e.target.value })}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={a.deadline}
                          onChange={(e) => updateItem(a.id, { deadline: e.target.value })}
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={a.status}
                          onValueChange={(v) =>
                            updateItem(a.id, { status: v as ActionItem["status"] })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUSES.map((s) => (
                              <SelectItem key={s} value={s}>
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Follow-up items & next steps</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc space-y-2 pl-5 text-sm">
                {summary.followUps.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </AppShell>
  );
}
