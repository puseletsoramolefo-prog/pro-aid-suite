// Deterministic, high-fidelity client-side fallbacks so every AI feature works
// out of the box, even with no backend/API key configured.

export type Tone = "Formal" | "Friendly" | "Persuasive" | "Professional";
export type Length = "Short" | "Medium" | "Detailed";

export const SAMPLE_EMAIL = {
  purpose: "Request a two-week extension on the Q3 compliance audit deliverable",
  recipient: "Naledi Mokoena, Head of Operations",
  notes: `- Audit evidence pack is 70% complete
- Two source systems (payroll, vendor master) were migrated late, delaying extraction
- Risk of submitting incomplete controls testing if we keep the current date
- Proposing new date: 26 September, with a progress checkpoint on 18 September
- Team is unblocked otherwise; no extra budget needed`,
};

export function mockEmail(input: {
  purpose: string;
  recipient: string;
  notes: string;
  tone: Tone;
  length: Length;
}) {
  const points = input.notes
    .split("\n")
    .map((l) => l.replace(/^[-*•\d.\s]+/, "").trim())
    .filter(Boolean);

  const name = input.recipient.split(",")[0]?.split(" ")[0] || "there";
  const greetings: Record<Tone, string> = {
    Formal: `Dear ${input.recipient || "Sir/Madam"},`,
    Friendly: `Hi ${name},`,
    Persuasive: `Hello ${name},`,
    Professional: `Hi ${name},`,
  };
  const openers: Record<Tone, string> = {
    Formal: `I am writing to you regarding ${lower(input.purpose)}.`,
    Friendly: `I wanted to reach out about ${lower(input.purpose)}.`,
    Persuasive: `I'd like to make a short case for ${lower(input.purpose)}.`,
    Professional: `I'm following up on ${lower(input.purpose)}.`,
  };
  const closings: Record<Tone, string> = {
    Formal: "Thank you for your consideration. I remain available should you require any further detail.",
    Friendly: "Thanks so much for looking at this — happy to talk it through whenever suits you.",
    Persuasive:
      "I'm confident this is the lowest-risk path forward, and I'd appreciate your approval so the team can proceed.",
    Professional: "Thank you for your time. Please let me know if you'd like anything adjusted.",
  };

  const bodyPoints = points.length ? points : ["The key details are outlined below for your review."];
  const detail = input.length === "Detailed";
  const short = input.length === "Short";

  const paragraphs: string[] = [openers[input.tone]];
  if (short) {
    paragraphs.push(bodyPoints.map((p) => sentence(p)).join(" "));
  } else {
    paragraphs.push(bodyPoints.slice(0, 3).map((p) => sentence(p)).join(" "));
    if (bodyPoints.length > 3) {
      paragraphs.push(bodyPoints.slice(3).map((p) => sentence(p)).join(" "));
    }
    if (detail) {
      paragraphs.push(
        "To keep this transparent, I've captured the underlying detail and dependencies so you can see exactly what changed and why. Nothing in the scope or budget changes as a result of this request.",
      );
      paragraphs.push(
        "If it's helpful, I can circulate a one-page summary ahead of our next check-in so the wider group has the same view.",
      );
    }
  }

  return {
    subject: titleCase(input.purpose || "Follow-up"),
    greeting: greetings[input.tone],
    body: paragraphs,
    closing: closings[input.tone],
    signoff: input.tone === "Friendly" ? "Best,\nAlex Dube" : "Kind regards,\nAlex Dube",
  };
}

export type EmailDraft = ReturnType<typeof mockEmail>;

export const SAMPLE_MEETING_NOTES = `Q3 Strategy & Operations Sync — 14 August, 10:00-11:05
Attendees: Alex Dube (Ops), Naledi Mokoena (Head of Ops), Sipho Khumalo (Finance), Rita Chen (People), Tom Adeyemi (IT)

- Naledi opened with Q3 numbers: throughput up 12%, but ticket backlog grew 8% in July.
- Sipho flagged that overtime spend is 14% over budget; mostly month-end reporting crunch.
- Rita raised that two admin roles are still vacant; hiring panel slots not confirmed.
- Tom said the payroll system migration slipped by two weeks; vendor master extract now due 12 Sept.
- Long discussion on automating the monthly admin report. Team agreed a pilot is worth it.
- Decision: pilot AI-assisted report drafting for September month-end, Ops only.
- Decision: freeze non-critical IT change requests until the payroll migration completes.
- Decision: approve one contractor for 6 weeks to clear the ticket backlog.
- Rita to confirm interview panel dates by Friday.
- Sipho to model the overtime saving from the report automation pilot.
- Tom to publish a revised migration timeline.
- Next sync: 28 August. Alex to circulate agenda 48 hours before.`;

export type ActionItem = {
  id: string;
  task: string;
  owner: string;
  deadline: string;
  status: "Not started" | "In progress" | "Done";
};

export type MeetingSummary = {
  executiveSummary: string;
  keyPoints: string[];
  decisions: string[];
  actionItems: ActionItem[];
  followUps: string[];
};

export function mockMeetingSummary(notes: string): MeetingSummary {
  const isSample = notes.trim().startsWith("Q3 Strategy & Operations Sync");
  if (!isSample) {
    const lines = notes
      .split("\n")
      .map((l) => l.replace(/^[-*•]\s*/, "").trim())
      .filter((l) => l.length > 3);
    return {
      executiveSummary:
        lines.length > 0
          ? `The session covered ${lines.length} discussion points. ${lines[0]} Outcomes and owners are captured below; items without an explicit owner in the notes are marked as unassigned rather than inferred.`
          : "No substantive content was detected in the supplied notes.",
      keyPoints: lines.slice(0, 6),
      decisions: lines.filter((l) => /decid|agree|approv|decision/i.test(l)).slice(0, 4),
      actionItems: lines
        .filter((l) => /\bto\b|will|follow up|action/i.test(l))
        .slice(0, 5)
        .map((l, i) => ({
          id: `a${i}`,
          task: l,
          owner: /^([A-Z][a-z]+)\s/.exec(l)?.[1] ?? "Unassigned",
          deadline: "Not specified",
          status: "Not started" as const,
        })),
      followUps: ["Confirm owners and deadlines for any item marked unassigned or not specified."],
    };
  }

  return {
    executiveSummary:
      "Operations delivered 12% higher throughput in Q3, but the ticket backlog grew 8% and overtime spend is tracking 14% over budget, largely due to month-end reporting effort. The payroll system migration has slipped by two weeks, pushing the vendor master extract to 12 September. The group approved a September pilot of AI-assisted report drafting in Ops, a temporary freeze on non-critical IT change requests, and one six-week contractor to clear the backlog.",
    keyPoints: [
      "Q3 throughput up 12%; July ticket backlog up 8%.",
      "Overtime spend 14% over budget, concentrated at month-end reporting.",
      "Two administrative roles remain vacant; interview panel dates unconfirmed.",
      "Payroll migration slipped two weeks; vendor master extract now due 12 September.",
      "Team supports piloting automation of the monthly administrative report.",
    ],
    decisions: [
      "Pilot AI-assisted report drafting for September month-end (Ops only)",
      "Freeze non-critical IT change requests until payroll migration completes",
      "Approve one contractor for six weeks to clear the ticket backlog",
    ],
    actionItems: [
      { id: "a1", task: "Confirm interview panel dates", owner: "Rita Chen", deadline: "Friday, 18 Aug", status: "Not started" },
      { id: "a2", task: "Model overtime saving from report automation pilot", owner: "Sipho Khumalo", deadline: "25 Aug", status: "In progress" },
      { id: "a3", task: "Publish revised payroll migration timeline", owner: "Tom Adeyemi", deadline: "21 Aug", status: "Not started" },
      { id: "a4", task: "Circulate agenda for next sync", owner: "Alex Dube", deadline: "26 Aug", status: "Not started" },
      { id: "a5", task: "Scope contractor onboarding for backlog clearance", owner: "Naledi Mokoena", deadline: "29 Aug", status: "Not started" },
    ],
    followUps: [
      "Next sync scheduled for 28 August; agenda due 48 hours prior.",
      "Revisit overtime trend once the September pilot results are available.",
      "Reassess the IT change freeze immediately after migration sign-off.",
    ],
  };
}

export type Priority = "High" | "Medium" | "Low";
export type PlannerTask = {
  id: string;
  name: string;
  priority: Priority;
  deadline: string;
  minutes: number;
};

export const SAMPLE_TASKS: PlannerTask[] = [
  { id: "t1", name: "Prepare monthly administrative report", priority: "High", deadline: "Today", minutes: 120 },
  { id: "t2", name: "Respond to client emails", priority: "High", deadline: "Today", minutes: 45 },
  { id: "t3", name: "Attend team meeting", priority: "Medium", deadline: "Today", minutes: 60 },
  { id: "t4", name: "Submit weekly report", priority: "Medium", deadline: "Friday", minutes: 40 },
  { id: "t5", name: "Update employee records", priority: "Low", deadline: "Friday", minutes: 90 },
];

export type PlanResult = {
  ranking: { name: string; reason: string }[];
  schedule: { time: string; item: string; kind: "task" | "break" }[];
  warnings: string[];
  recommendations: string[];
};

export function mockPlan(tasks: PlannerTask[], scope: "Daily" | "Weekly"): PlanResult {
  const weight: Record<Priority, number> = { High: 0, Medium: 1, Low: 2 };
  const ordered = [...tasks].sort(
    (a, b) => weight[a.priority] - weight[b.priority] || a.minutes - b.minutes,
  );
  const total = tasks.reduce((s, t) => s + t.minutes, 0);

  const schedule: PlanResult["schedule"] = [];
  let cursor = 9 * 60;
  let sinceBreak = 0;
  for (const t of ordered) {
    if (sinceBreak >= 90) {
      schedule.push({ time: `${fmt(cursor)} – ${fmt(cursor + 15)}`, item: "Break / reset", kind: "break" });
      cursor += 15;
      sinceBreak = 0;
    }
    const label = scope === "Weekly" ? `${t.deadline}: ${t.name}` : t.name;
    schedule.push({ time: `${fmt(cursor)} – ${fmt(cursor + t.minutes)}`, item: label, kind: "task" });
    cursor += t.minutes;
    sinceBreak += t.minutes;
    if (cursor >= 12 * 60 + 30 && cursor < 13 * 60 + 30) {
      schedule.push({ time: `${fmt(cursor)} – ${fmt(cursor + 45)}`, item: "Lunch", kind: "break" });
      cursor += 45;
      sinceBreak = 0;
    }
  }

  const warnings: string[] = [];
  const dueToday = tasks.filter((t) => /today/i.test(t.deadline));
  const todayLoad = dueToday.reduce((s, t) => s + t.minutes, 0);
  if (scope === "Daily" && todayLoad > 6 * 60)
    warnings.push(`Today's committed work is ${hrs(todayLoad)}, which exceeds a realistic 6-hour focus budget.`);
  if (dueToday.length >= 3)
    warnings.push(`${dueToday.length} items share a "Today" deadline — at least one will likely slip without renegotiation.`);
  if (cursor > 17 * 60)
    warnings.push(`The plan runs past 17:00 (ends ${fmt(cursor)}). Consider moving a low-priority item.`);
  if (!warnings.length) warnings.push("No scheduling conflicts detected for this scope.");

  return {
    ranking: ordered.map((t) => ({
      name: t.name,
      reason:
        t.priority === "High"
          ? `High priority, due ${t.deadline.toLowerCase()} — do this before context-switching work.`
          : t.priority === "Medium"
            ? `Medium priority, ${hrs(t.minutes)} of effort — fits well after the critical items.`
            : `Low priority — safe to batch late in the ${scope === "Daily" ? "day" : "week"} or delegate.`,
    })),
    schedule,
    warnings,
    recommendations: [
      `Total committed effort is ${hrs(total)} across ${tasks.length} tasks.`,
      "Handle the administrative report first, while attention is highest; it has the largest cognitive load.",
      "Batch email responses into one fixed window rather than checking continuously.",
      "Protect a 15-minute break after every 90 minutes of focused work to sustain output.",
      scope === "Weekly"
        ? "Reserve Friday afternoon for overflow — weekly plans that are 100% allocated fail on the first interruption."
        : "Leave the final hour unallocated as buffer for unplanned requests.",
    ],
  };
}

export type Depth = "Quick Overview" | "Detailed Explanation" | "Key Insights" | "Recommendations";

export const RESEARCH_CHIPS = [
  "AI adoption in HR workflows",
  "Hybrid work policy benchmarks",
  "Reducing month-end reporting effort",
  "Measuring administrative productivity",
];

export type ResearchResult = {
  overview: string;
  insights: string[];
  advantages: string[];
  disadvantages: string[];
  recommendations: string[];
  furtherQuestions: string[];
  confidence: "High" | "Moderate" | "Low";
};

export function mockResearch(topic: string, depth: Depth): ResearchResult {
  const t = topic.trim() || "the requested topic";
  const long = depth === "Detailed Explanation";
  return {
    overview: long
      ? `${titleCase(t)} sits at the intersection of process design, workforce capability and governance. Organisations that move early typically start with a narrow, high-volume, low-risk workflow, measure the time saved against a documented baseline, and only then widen scope. The dominant failure mode is not the technology — it is adopting it without a measurement baseline, an owner, or a review step, which makes benefits impossible to prove and errors hard to catch.`
      : `${titleCase(t)} is most successful when introduced into a single high-volume workflow with a clear owner, a documented time baseline, and a mandatory human review step before anything is used externally.`,
    insights: [
      "Gains concentrate in repetitive drafting, summarising and structuring work rather than in judgement-heavy decisions.",
      "Teams that define a measurement baseline before adoption report benefits far more credibly than those that don't.",
      "Review-before-send policies materially reduce the risk of factual errors reaching customers or regulators.",
      ...(depth === "Key Insights" || long
        ? [
            "Adoption stalls most often at the middle-management layer, where accountability for output quality sits.",
            "Training that focuses on verification skills outperforms training that focuses on prompt syntax.",
          ]
        : []),
    ],
    advantages: [
      "Substantial reduction in first-draft time for routine written work",
      "More consistent structure and tone across a team",
      "Faster onboarding for new administrative staff",
      "Frees senior time for exception handling and judgement",
    ],
    disadvantages: [
      "Outputs can be confidently wrong and require verification",
      "Sensitive data handling needs an explicit policy before rollout",
      "Over-reliance can erode domain skills if review is treated as a formality",
      "Benefits are hard to prove without a pre-adoption baseline",
    ],
    recommendations: [
      "Pick one workflow, measure the current time cost for two weeks, then pilot.",
      "Require a named human reviewer on any output that leaves the organisation.",
      "Publish a short data-handling rule: what may and may not be pasted in.",
      "Review pilot metrics at 30 and 90 days before expanding scope.",
      ...(depth === "Recommendations"
        ? [
            "Appoint a single accountable owner per workflow, not per tool.",
            "Budget for verification time — it is a real cost, not overhead.",
          ]
        : []),
    ],
    furtherQuestions: [
      `What is the current, measured time cost of ${lower(t)} in your own organisation?`,
      "Which outputs carry regulatory or contractual exposure if they contain an error?",
      "Who signs off quality, and how is that sign-off evidenced?",
      "What would make you stop the pilot?",
    ],
    confidence: long ? "Moderate" : "Moderate",
  };
}

export const CHAT_SUGGESTIONS = [
  "Draft an apology for delayed deliverable",
  "Prepare agenda for 1-on-1",
  "Help summarize this paragraph",
  "Turn these notes into action items",
];

export function mockChat(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("apolog") || m.includes("delay")) {
    return `Here's a draft you can adapt:

**Subject:** Update on the delayed deliverable

Hi [Name],

I want to flag that the [deliverable] will now be ready on [new date] rather than [original date]. The delay came from [brief, factual cause] — I take responsibility for not raising it sooner.

Here's what's changed and what happens next:

- **Current status:** [x% complete / what's done]
- **New date:** [date], with a checkpoint on [date]
- **Mitigation:** [what you're doing so it doesn't slip again]

Nothing else in the scope changes. Happy to walk through the detail whenever suits you.

Kind regards,
[Your name]

*Replace the bracketed fields — I've deliberately not invented dates or causes.*`;
  }
  if (m.includes("agenda") || m.includes("1-on-1") || m.includes("one-on-one")) {
    return `A solid 30-minute 1-on-1 agenda:

1. **Check-in (3 min)** — how the last two weeks actually felt, not just status.
2. **Their agenda first (10 min)** — blockers, decisions they need from you.
3. **Progress & priorities (8 min)** — what's on track, what needs re-ordering.
4. **Feedback both ways (5 min)** — one specific thing each.
5. **Growth / next steps (4 min)** — one commitment each, written down.

Tip: send the agenda 24 hours ahead and let them add items — attendance quality improves noticeably.`;
  }
  if (m.includes("summar")) {
    return `Paste the paragraph and I'll return:

- a **one-sentence** summary,
- **three** key points,
- any **action items** with owners, if the text names them.

I'll keep to what's in your text and flag anything ambiguous rather than filling gaps.`;
  }
  return `Happy to help with that. To keep the answer useful and workplace-specific, tell me:

- **Goal** — what should the output achieve?
- **Audience** — who reads it?
- **Constraints** — tone, length, deadline, anything I must not say.

If you'd rather just start, paste your raw notes and I'll structure them into a first draft you can edit.`;
}

export const RECENT_ACTIVITY = [
  { id: 1, label: "Generated an extension-request email", module: "Email Generator", when: "12 minutes ago" },
  { id: 2, label: "Summarised “Q3 Strategy & Operations Sync”", module: "Meeting Notes", when: "1 hour ago" },
  { id: 3, label: "Built a daily schedule for 5 tasks", module: "Task Planner", when: "3 hours ago" },
  { id: 4, label: "Researched “Hybrid work policy benchmarks”", module: "Research", when: "Yesterday" },
];

// helpers
function lower(s: string) {
  return s ? s.charAt(0).toLowerCase() + s.slice(1) : s;
}
function titleCase(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}
function sentence(s: string) {
  const clean = titleCase(s.trim());
  return /[.!?]$/.test(clean) ? clean : `${clean}.`;
}
function fmt(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
function hrs(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h ? `${h}h${m ? ` ${m}m` : ""}` : `${m}m`;
}
