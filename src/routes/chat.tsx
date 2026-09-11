import { createFileRoute } from "@tanstack/react-router";
import { Bot, Copy, MessageSquarePlus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SYSTEM, askText } from "@/lib/ai";
import { CHAT_SUGGESTIONS, mockChat } from "@/lib/mock";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Workplace Chat — Workplace AI" },
      {
        name: "description",
        content:
          "Chat with a workplace-focused AI assistant to draft, plan, summarise and think through work problems.",
      },
      { property: "og:title", content: "AI Workplace Chat — Workplace AI" },
      {
        property: "og:description",
        content: "Chat with a workplace-focused AI assistant to draft, plan and summarise.",
      },
    ],
  }),
  component: ChatPage,
});

type ChatMessage = { id: string; role: "user" | "assistant"; text: string };
type Thread = { id: string; title: string; messages: ChatMessage[] };

const STARTER_THREADS: Thread[] = [
  { id: "t-current", title: "New conversation", messages: [] },
  {
    id: "t-1",
    title: "Apology for delayed deliverable",
    messages: [
      { id: "m1", role: "user", text: "Draft an apology for delayed deliverable" },
      { id: "m2", role: "assistant", text: mockChat("Draft an apology for delayed deliverable") },
    ],
  },
  {
    id: "t-2",
    title: "1-on-1 agenda",
    messages: [
      { id: "m3", role: "user", text: "Prepare agenda for 1-on-1" },
      { id: "m4", role: "assistant", text: mockChat("Prepare agenda for 1-on-1") },
    ],
  },
];

function ChatPage() {
  const [threads, setThreads] = useState<Thread[]>(STARTER_THREADS);
  const [activeId, setActiveId] = useState("t-current");
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  const active = threads.find((t) => t.id === activeId) ?? threads[0];

  function setMessages(updater: (m: ChatMessage[]) => ChatMessage[], title?: string) {
    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeId
          ? {
              ...t,
              title: title && t.title === "New conversation" ? title : t.title,
              messages: updater(t.messages),
            }
          : t,
      ),
    );
  }

  async function send(content: string) {
    const value = content.trim();
    if (!value || busy) return;
    setText("");
    setBusy(true);
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", text: value };
    setMessages((m) => [...m, userMsg], value.slice(0, 40));

    const history = [...(active?.messages ?? []), userMsg]
      .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.text}`)
      .join("\n\n");

    const reply = await askText({
      system: SYSTEM.chat,
      prompt: `${history}\n\nAssistant:`,
      fallback: () => mockChat(value),
    });

    setMessages((m) => [
      ...m,
      { id: crypto.randomUUID(), role: "assistant", text: reply.data },
    ]);
    setBusy(false);
  }

  return (
    <AppShell
      title="AI Workplace Chat"
      subtitle="A workplace-only assistant. Ask it to draft, restructure, plan or explain — it will ask for missing detail rather than invent it."
      banner={false}
    >
      <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
        <Card className="order-2 lg:order-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Chat history</CardTitle>
            <CardDescription className="text-xs">Demo conversations included.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            <Button
              variant="outline"
              size="sm"
              className="mb-2 w-full justify-start gap-2"
              onClick={() => {
                const id = crypto.randomUUID();
                setThreads([{ id, title: "New conversation", messages: [] }, ...threads]);
                setActiveId(id);
              }}
            >
              <MessageSquarePlus className="size-4" /> New chat
            </Button>
            {threads.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveId(t.id)}
                className={`w-full truncate rounded-md px-3 py-2 text-left text-sm transition-colors ${
                  t.id === activeId ? "bg-primary/10 text-primary" : "hover:bg-muted"
                }`}
              >
                {t.title}
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="order-1 flex h-[70vh] flex-col overflow-hidden lg:order-2">
          <CardContent className="flex min-h-0 flex-1 flex-col gap-3 p-4">
            <Conversation className="min-h-0 flex-1">
              <ConversationContent className="space-y-4">
                {active && active.messages.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center gap-3 py-12 text-center">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Bot className="size-6" />
                    </div>
                    <div>
                      <p className="font-display text-base font-semibold">
                        How can I help with your work today?
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Pick a starter below, or type your own request.
                      </p>
                    </div>
                  </div>
                ) : (
                  active?.messages.map((m) => (
                    <Message key={m.id} from={m.role}>
                      <MessageContent>
                        {m.role === "assistant" ? (
                          <>
                            <MessageResponse>{m.text}</MessageResponse>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(m.text);
                                toast.success("Response copied");
                              }}
                              className="mt-1 inline-flex items-center gap-1.5 self-start text-xs text-muted-foreground hover:text-foreground"
                            >
                              <Copy className="size-3.5" /> Copy response
                            </button>
                          </>
                        ) : (
                          <p className="whitespace-pre-wrap">{m.text}</p>
                        )}
                      </MessageContent>
                    </Message>
                  ))
                )}
                {busy ? <Shimmer className="text-sm">Thinking…</Shimmer> : null}
              </ConversationContent>
              <ConversationScrollButton />
            </Conversation>

            <div className="flex flex-wrap gap-2">
              {CHAT_SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => void send(s)}
                  disabled={busy}
                  className="rounded-full border bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-primary/10 hover:text-primary disabled:opacity-50"
                >
                  {s}
                </button>
              ))}
            </div>

            <PromptInput
              onSubmit={(message) => {
                void send(message.text || text);
              }}
            >
              <PromptInputTextarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Ask about drafting, planning, meetings or process…"
              />
              <PromptInputFooter className="justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="gap-2"
                  onClick={() => {
                    setMessages(() => []);
                    toast.success("Conversation cleared");
                  }}
                >
                  <Trash2 className="size-4" /> Clear conversation
                </Button>
                <PromptInputSubmit status={busy ? "submitted" : undefined} disabled={busy} />
              </PromptInputFooter>
            </PromptInput>

            <p className="text-xs text-muted-foreground">
              AI-generated content may contain errors or omissions. Always review and verify AI
              outputs before using them.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
