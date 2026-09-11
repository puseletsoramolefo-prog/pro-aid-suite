import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Copy, HelpCircle, Search, Sparkles } from "lucide-react";
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
import { SYSTEM, askJson } from "@/lib/ai";
import { RESEARCH_CHIPS, mockResearch, type Depth, type ResearchResult } from "@/lib/mock";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Workplace AI" },
      {
        name: "description",
        content:
          "Get a balanced overview, key insights, trade-offs and practical recommendations on any workplace topic.",
      },
      { property: "og:title", content: "AI Research Assistant — Workplace AI" },
      {
        property: "og:description",
        content: "Balanced overviews, trade-offs and practical next steps on any workplace topic.",
      },
    ],
  }),
  component: ResearchPage,
});

const DEPTHS: Depth[] = [
  "Quick Overview",
  "Detailed Explanation",
  "Key Insights",
  "Recommendations",
];

function isResearch(v: unknown): v is ResearchResult {
  const r = v as ResearchResult;
  return !!r && typeof r.overview === "string" && Array.isArray(r.insights);
}

function ResearchPage() {
  const [topic, setTopic] = useState("");
  const [depth, setDepth] = useState<Depth>("Key Insights");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [source, setSource] = useState<"cloud" | "demo">("demo");

  async function run(query = topic) {
    if (!query.trim()) {
      toast.error("Enter a topic or question first.");
      return;
    }
    setLoading(true);
    const r = await askJson<ResearchResult>({
      system: SYSTEM.research,
      prompt: `Research topic: ${query}
Depth: ${depth}

Return JSON: {"overview":string,"insights":string[],"advantages":string[],"disadvantages":string[],"recommendations":string[],"furtherQuestions":string[],"confidence":"High"|"Moderate"|"Low"}`,
      fallback: () => mockResearch(query, depth),
      validate: isResearch,
    });
    setResult(r.data);
    setSource(r.source);
    setLoading(false);
    toast.success("Research ready — verify anything you'll rely on.");
  }

  function copyAll() {
    if (!result) return;
    const text = [
      `TOPIC: ${topic}`,
      "",
      "EXECUTIVE OVERVIEW",
      result.overview,
      "",
      "KEY INSIGHTS",
      ...result.insights.map((i) => `- ${i}`),
      "",
      "ADVANTAGES",
      ...result.advantages.map((i) => `- ${i}`),
      "",
      "DISADVANTAGES",
      ...result.disadvantages.map((i) => `- ${i}`),
      "",
      "RECOMMENDATIONS",
      ...result.recommendations.map((i) => `- ${i}`),
      "",
      "QUESTIONS FOR FURTHER RESEARCH",
      ...result.furtherQuestions.map((i) => `- ${i}`),
    ].join("\n");
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  }

  return (
    <AppShell
      title="AI Research Assistant"
      subtitle="Ask a work question and get a structured briefing — deliberately balanced, with the gaps and caveats made explicit."
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Research request</CardTitle>
          <CardDescription>Be specific — a sharper question gives a sharper briefing.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_220px]">
            <div className="space-y-2">
              <Label htmlFor="topic">Topic or research question</Label>
              <Input
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. How should we measure administrative productivity?"
              />
            </div>
            <div className="space-y-2">
              <Label>Depth</Label>
              <Select value={depth} onValueChange={(v) => setDepth(v as Depth)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DEPTHS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {RESEARCH_CHIPS.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setTopic(c);
                  void run(c);
                }}
                className="rounded-full border bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-primary/10 hover:text-primary"
              >
                {c}
              </button>
            ))}
          </div>

          <Button onClick={() => run()} disabled={loading} className="gap-2">
            <Sparkles className="size-4" />
            {loading ? "Researching…" : "Run research"}
          </Button>
        </CardContent>
      </Card>

      <div className="flex items-start gap-3 rounded-xl border border-warning/50 bg-warning/15 px-4 py-3 text-sm">
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" />
        <p>
          <strong>Verify your sources.</strong> This briefing is generated from a language model and
          contains no live citations. Confirm any figure, claim or benchmark against a primary source
          before quoting it in a report or decision.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : !result ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Search className="mx-auto size-6 text-muted-foreground" />
            <p className="mt-3 text-sm font-medium">No briefing yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Tap a sample topic above for an instant example.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={source === "cloud" ? "default" : "secondary"}>
              {source === "cloud" ? "AI generated" : "Demo mode"}
            </Badge>
            <Badge variant="outline">Confidence: {result.confidence}</Badge>
            <Button size="sm" variant="secondary" className="gap-2" onClick={copyAll}>
              <Copy className="size-4" /> Copy briefing
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Executive overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{result.overview}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Key insights & findings</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc space-y-2 pl-5 text-sm">
                {result.insights.map((i, k) => (
                  <li key={k}>{i}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Advantages</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-5 text-sm">
                  {result.advantages.map((i, k) => (
                    <li key={k}>{i}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Disadvantages</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-5 text-sm">
                  {result.disadvantages.map((i, k) => (
                    <li key={k}>{i}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Practical recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal space-y-2 pl-5 text-sm">
                {result.recommendations.map((i, k) => (
                  <li key={k}>{i}</li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <HelpCircle className="size-4 text-primary" /> Questions for further research
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc space-y-2 pl-5 text-sm">
                {result.furtherQuestions.map((i, k) => (
                  <li key={k}>{i}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </AppShell>
  );
}
