import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { useOrbit } from "@/lib/orbit-store";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Bell, Edit2, LogOut, Settings as Cog, Clock, Crown } from "lucide-react";

export function QuickProfilePanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state, signOut } = useOrbit();
  const nav = useNavigate();
  const go = (to: string) => { onClose(); setTimeout(() => nav({ to: to as never }), 50); };

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="top"
        className="mx-auto max-w-[440px] rounded-b-3xl bg-popover border-border p-0 max-h-[88vh] overflow-y-auto"
      >
        <SheetHeader className="sr-only"><SheetTitle>Quick profile</SheetTitle></SheetHeader>
        <div className="px-5 pt-5 pb-3 flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[var(--orbit-blue)] to-[oklch(0.55_0.18_265)] grid place-items-center text-base font-semibold ring-1 ring-white/10">
            {state.user.name[0]}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold truncate">{state.user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{state.user.email}</p>
          </div>
          {state.user.premium && (
            <span className="inline-flex items-center gap-1 text-[10.5px] uppercase tracking-wider font-medium px-2 py-0.5 rounded-full bg-[var(--orbit-blue)]/15 text-[var(--orbit-blue)] ring-1 ring-[var(--orbit-blue)]/30">
              <Crown className="h-3 w-3" /> Premium
            </span>
          )}
        </div>

        <div className="mx-5 mb-3 grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-surface ring-1 ring-border p-3">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Streak</p>
            <p className="text-lg font-semibold mt-0.5">{state.user.streak} days 🔥</p>
          </div>
          <div className="rounded-xl bg-surface ring-1 ring-border p-3">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Reminders</p>
            <p className="text-lg font-semibold mt-0.5">{state.reminders.length}</p>
          </div>
        </div>

        <div className="px-3 pb-2">
          <QuickRow icon={Edit2} label="Edit profile" onClick={() => go("/profile/personal")} />
          <QuickRow icon={Bell} label="Notifications" onClick={() => go("/notifications")} />
          <QuickRow icon={Clock} label="Reminders" onClick={() => go("/notifications")} />
          <QuickRow icon={Cog} label="Settings" onClick={() => go("/profile")} />
        </div>

        <div className="px-5 pb-5">
          <Button
            variant="outline"
            className="w-full h-11 rounded-full bg-surface"
            onClick={() => { signOut(); toast.success("Signed out"); onClose(); setTimeout(() => nav({ to: "/auth/login" as never }), 50); }}
          >
            <LogOut className="h-4 w-4 mr-2" /> Sign out
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function QuickRow({ icon: Icon, label, onClick }: { icon: React.ElementType; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-surface transition text-left"
    >
      <Icon className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm font-medium flex-1">{label}</span>
      <span className="text-muted-foreground">›</span>
    </button>
  );
}

export const __useLink = Link;
