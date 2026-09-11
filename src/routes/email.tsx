import { createFileRoute } from "@tanstack/react-router";
import { Copy, Eraser, RefreshCw, Sparkles, Wand2 } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { SYSTEM, askJson } from "@/lib/ai";
import { SAMPLE_EMAIL, mockEmail, type EmailDraft, type Length, type Tone } from "@/lib/mock";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Workplace AI" },
      {
        name: "description",
        content:
          "Turn rough notes into a polished workplace email with tone and length control, then edit and copy it.",
      },
      { property: "og:title", content: "Smart Email Generator — Workplace AI" },
      {
        property: "og:description",
        content: "Turn rough notes into a polished workplace email with tone and length control.",
      },
    ],
  }),
  component: EmailPage,
});

const TONES: Tone[] = ["Formal", "Friendly", "Persuasive", "Professional"];
const LENGTHS: Length[] = ["Short", "Medium", "Detailed"];

function isDraft(v: unknown): v is EmailDraft {
  const d = v as EmailDraft;
  return !!d && typeof d.subject === "string" && Array.isArray(d.body);
}

function EmailPage() {
  const [purpose, setPurpose] = useState("");
  const [recipient, setRecipient] = useState("");
  const [notes, setNotes] = useState("");
  const [tone, setTone] = useState<Tone>("Professional");
  const [length, setLength] = useState<Length>("Medium");
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState<EmailDraft | null>(null);
  const [source, setSource] = useState<"cloud" | "demo">("demo");

  async function generate() {
    if (!purpose.trim() && !notes.trim()) {
      toast.error("Add an email purpose or some notes first.");
      return;
    }
    setLoading(true);
    const input = { purpose, recipient, notes, tone, length };
    const result = await askJson<EmailDraft>({
      system: SYSTEM.email,
      prompt: `Write a workplace email.
Purpose: ${purpose}
Recipient: ${recipient || "unspecified"}
Tone: ${tone}
Length: ${length}
Key points / notes:
${notes}

Return JSON: {"subject":string,"greeting":string,"body":string[],"closing":string,"signoff":string}`,
      fallback: () => mockEmail(input),
      validate: isDraft,
    });
    setDraft(result.data);
    setSource(result.source);
    setLoading(false);
    toast.success("Email drafted — review before sending.");
  }

  const plain = draft
    ? `Subject: ${draft.subject}\n\n${draft.greeting}\n\n${draft.body.join("\n\n")}\n\n${draft.closing}\n\n${draft.signoff}`
    : "";

  return (
    <AppShell
      title="Smart Email Generator"
      subtitle="Give the assistant your purpose and rough notes. It preserves your meaning, adapts the tone, and never invents facts."
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Email brief</CardTitle>
            <CardDescription>Everything below feeds the draft directly.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="purpose">Email purpose</Label>
              <Input
                id="purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="e.g. Request a deadline extension"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient</Label>
              <Input
                id="recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="e.g. Naledi Mokoena, Head of Operations"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Key points / notes</Label>
              <Textarea
                id="notes"
                rows={8}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Paste bullet points, half-sentences, anything…"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Tone</Label>
                <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TONES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Length</Label>
                <Select value={length} onValueChange={(v) => setLength(v as Length)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LENGTHS.map((l) => (
                      <SelectItem key={l} value={l}>
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <Button onClick={generate} disabled={loading} className="gap-2">
                <Sparkles className="size-4" />
                {loading ? "Generating…" : "Generate email"}
              </Button>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => {
                  setPurpose(SAMPLE_EMAIL.purpose);
                  setRecipient(SAMPLE_EMAIL.recipient);
                  setNotes(SAMPLE_EMAIL.notes);
                  toast.success("Sample notes loaded");
                }}
              >
                <Wand2 className="size-4" /> Load sample notes
              </Button>
              <Button
                variant="ghost"
                className="gap-2"
                onClick={() => {
                  setPurpose("");
                  setRecipient("");
                  setNotes("");
                  setDraft(null);
                }}
              >
                <Eraser className="size-4" /> Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
            <div>
              <CardTitle className="text-base">Generated email</CardTitle>
              <CardDescription>Fully editable — click into any field and adjust.</CardDescription>
            </div>
            {draft ? (
              <Badge variant={source === "cloud" ? "default" : "secondary"}>
                {source === "cloud" ? "AI generated" : "Demo mode"}
              </Badge>
            ) : null}
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-16 w-full" />
                <p className="text-xs text-muted-foreground">Composing your draft…</p>
              </div>
            ) : !draft ? (
              <div className="rounded-lg border border-dashed p-10 text-center">
                <p className="text-sm font-medium">No draft yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Load the sample notes and press Generate to see a full example.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject line</Label>
                  <Input
                    id="subject"
                    value={draft.subject}
                    onChange={(e) => setDraft({ ...draft, subject: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="greeting">Greeting</Label>
                  <Input
                    id="greeting"
                    value={draft.greeting}
                    onChange={(e) => setDraft({ ...draft, greeting: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="body">Body</Label>
                  <Textarea
                    id="body"
                    rows={10}
                    value={draft.body.join("\n\n")}
                    onChange={(e) => setDraft({ ...draft, body: e.target.value.split("\n\n") })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="closing">Closing</Label>
                  <Textarea
                    id="closing"
                    rows={2}
                    value={draft.closing}
                    onChange={(e) => setDraft({ ...draft, closing: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signoff">Sign-off</Label>
                  <Textarea
                    id="signoff"
                    rows={2}
                    value={draft.signoff}
                    onChange={(e) => setDraft({ ...draft, signoff: e.target.value })}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    className="gap-2"
                    onClick={() => {
                      navigator.clipboard.writeText(plain);
                      toast.success("Copied to clipboard");
                    }}
                  >
                    <Copy className="size-4" /> Copy to clipboard
                  </Button>
                  <Button variant="outline" className="gap-2" onClick={generate} disabled={loading}>
                    <RefreshCw className="size-4" /> Regenerate
                  </Button>
                  <Button variant="ghost" className="gap-2" onClick={() => setDraft(null)}>
                    <Eraser className="size-4" /> Clear draft
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
