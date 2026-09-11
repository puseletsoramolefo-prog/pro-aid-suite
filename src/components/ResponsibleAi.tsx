import { ShieldCheck, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export function ResponsibleAiBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary",
        className,
      )}
    >
      <ShieldCheck className="size-3.5" aria-hidden="true" />
      Responsible AI
    </span>
  );
}

export function ResponsibleAiBanner({ className }: { className?: string }) {
  return (
    <div
      role="note"
      className={cn(
        "flex items-start gap-3 rounded-xl border border-accent/60 bg-accent/40 px-4 py-3 text-sm text-accent-foreground",
        className,
      )}
    >
      <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <p>
        AI-generated content may contain errors or omissions. Always review and verify AI outputs
        before using them for important workplace decisions. Do not enter confidential, private,
        financial, password, or sensitive personal information.
      </p>
    </div>
  );
}
