import { createFileRoute, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { ScreenHeader } from "@/components/orbit/AppFrame";
import { Camera, FileText, Mic, Type as TypeIcon, ListPlus, Mail } from "lucide-react";
import type { CaptureKind } from "@/lib/orbit-types";
import { CaptureModal } from "@/components/orbit/CaptureModal";

export const Route = createFileRoute("/_app/capture")({ component: Capture });

const METHODS: { kind: CaptureKind; icon: React.ElementType; label: string; sub: string }[] = [
  { kind: "screenshot", icon: Camera, label: "Upload Screenshot", sub: "Bills, chats, invoices, contracts" },
  { kind: "document", icon: FileText, label: "Scan Document", sub: "Invoices, contracts, receipts" },
  { kind: "voice", icon: Mic, label: "Record Voice", sub: "Speak it. Orbit transcribes." },
  { kind: "text", icon: TypeIcon, label: "Paste Text", sub: "Any snippet, link, or note" },
  { kind: "manual", icon: ListPlus, label: "Manual Task", sub: "Type a task by hand" },
  { kind: "email", icon: Mail, label: "Connect Email", sub: "Forward important emails" },
];

function Capture() {
  const [active, setActive] = React.useState<CaptureKind | null>(null);
  const nav = useNavigate();

  return (
    <div>
      <ScreenHeader title="Capture" />
      <div className="px-5 pt-5 pb-10">
        <p className="text-sm text-muted-foreground mb-5">Drop anything in. Orbit will understand.</p>
        <div className="grid grid-cols-2 gap-3">
          {METHODS.map((m) => {
            const Icon = m.icon;
            return (
              <button
                key={m.kind}
                onClick={() => setActive(m.kind)}
                className="text-left rounded-2xl bg-surface ring-1 ring-border p-4 hover:bg-surface-2 hover:ring-[var(--orbit-blue)]/30 transition active:scale-[0.98] min-h-[124px] flex flex-col"
              >
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[var(--orbit-blue)]/30 to-[var(--orbit-blue)]/0 ring-1 ring-[var(--orbit-blue)]/20 grid place-items-center mb-3">
                  <Icon className="h-4.5 w-4.5 text-[var(--orbit-blue)]" />
                </div>
                <p className="text-sm font-semibold tracking-tight">{m.label}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{m.sub}</p>
              </button>
            );
          })}
        </div>
      </div>
      <CaptureModal kind={active} onClose={() => setActive(null)} onAdded={(id) => { setActive(null); nav({ to: "/items/$id", params: { id } }); }} />
    </div>
  );
}
