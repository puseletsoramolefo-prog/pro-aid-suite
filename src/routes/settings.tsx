import { createFileRoute } from "@tanstack/react-router";
import { RotateCcw, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
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
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Workplace AI" },
      {
        name: "description",
        content:
          "Manage your profile, AI model preference, default tone presets, privacy controls and demo data.",
      },
      { property: "og:title", content: "Settings — Workplace AI" },
      {
        property: "og:description",
        content: "Profile, AI model preference, tone presets, privacy controls and demo data.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [name, setName] = useState("Alex Dube");
  const [email, setEmail] = useState("alex.dube@example.com");
  const [role, setRole] = useState("Operations Manager");
  const [model, setModel] = useState("balanced");
  const [tone, setTone] = useState("Professional");
  const [redact, setRedact] = useState(true);
  const [history, setHistory] = useState(true);
  const [training, setTraining] = useState(false);

  return (
    <AppShell
      title="Settings"
      subtitle="Control how the assistant writes, what it remembers, and what sample data the workspace shows."
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profile</CardTitle>
          <CardDescription>Used to personalise greetings and email sign-offs.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Work email</Label>
            <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Job title</Label>
            <Input id="role" value={role} onChange={(e) => setRole(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">AI preferences</CardTitle>
          <CardDescription>
            Applies across the email generator, summariser, planner and planner.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Model preference</Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fast">Fast — quick drafts, lowest latency</SelectItem>
                <SelectItem value="balanced">Balanced — recommended</SelectItem>
                <SelectItem value="deep">Deep reasoning — slower, more thorough</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Default tone preset</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Formal">Formal</SelectItem>
                <SelectItem value="Friendly">Friendly</SelectItem>
                <SelectItem value="Persuasive">Persuasive</SelectItem>
                <SelectItem value="Professional">Professional</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Privacy controls</CardTitle>
          <CardDescription>Decide what leaves your device and what is kept.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ToggleRow
            label="Redact obvious personal data before sending"
            hint="Masks email addresses and phone numbers detected in your input."
            checked={redact}
            onChange={setRedact}
          />
          <Separator />
          <ToggleRow
            label="Keep recent drafts in this browser"
            hint="History stays local to this device and is never uploaded."
            checked={history}
            onChange={setHistory}
          />
          <Separator />
          <ToggleRow
            label="Allow my content to improve the assistant"
            hint="Off by default. Recommended to stay off for confidential work."
            checked={training}
            onChange={setTraining}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Workspace data</CardTitle>
          <CardDescription>Reset the demo or clear locally cached content.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button
            className="gap-2"
            onClick={() => toast.success("Settings saved")}
          >
            <Save className="size-4" /> Save settings
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => toast.success("Sample demo data restored")}
          >
            <RotateCcw className="size-4" /> Reset demo data
          </Button>
          <Button
            variant="destructive"
            className="gap-2"
            onClick={() => {
              localStorage.clear();
              toast.success("Local cache cleared");
            }}
          >
            <Trash2 className="size-4" /> Clear cache
          </Button>
        </CardContent>
      </Card>
    </AppShell>
  );
}

function ToggleRow({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">{hint}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} aria-label={label} />
    </div>
  );
}
