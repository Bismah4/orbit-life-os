import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { Bell, ChevronRight, Sparkles } from "lucide-react";
import { useOrbit } from "@/lib/orbit-store";
import { CategoryChip, PriorityChip } from "@/components/orbit/Chips";
import { QuickProfilePanel } from "@/components/orbit/QuickProfilePanel";

export const Route = createFileRoute("/_app/home")({ component: Home });

function Home() {
  const { state } = useOrbit();
  const nav = useNavigate();
  const [qp, setQp] = React.useState(false);

  const active = state.items.filter((i) => !i.completedAt);
  const top = active.slice(0, 3);
  const canWait = active.slice(3, 6);
  const upcomingReminders = state.reminders.filter((r) => !r.completed && new Date(r.remindAt).getTime() > Date.now()).length;

  return (
    <div className="px-5 pt-5 pb-8 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Good day,</p>
          <h1 className="text-2xl font-semibold tracking-tight">{state.user.name.split(" ")[0]}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/notifications" aria-label="Notifications" className="relative h-10 w-10 grid place-items-center rounded-full bg-surface ring-1 ring-border hover:bg-surface-2 transition">
            <Bell className="h-4.5 w-4.5" />
            {upcomingReminders > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full bg-[var(--pri-high)] text-[10px] font-semibold text-white grid place-items-center ring-2 ring-background">
                {upcomingReminders > 9 ? "9+" : upcomingReminders}
              </span>
            )}
          </Link>
          <button onClick={() => setQp(true)} aria-label="Quick profile" className="h-10 w-10 rounded-full bg-gradient-to-br from-[var(--orbit-blue)] to-[oklch(0.55_0.18_265)] grid place-items-center text-sm font-semibold ring-1 ring-white/10">
            {state.user.name[0]}
          </button>
        </div>
      </header>

      {/* Daily Pulse */}
      <button
        onClick={() => nav({ to: "/daily-pulse" })}
        className="w-full text-left rounded-2xl bg-gradient-to-br from-[var(--orbit-blue)]/20 to-transparent ring-1 ring-[var(--orbit-blue)]/30 p-5 hover:ring-[var(--orbit-blue)]/50 transition active:scale-[0.99]"
      >
        <div className="flex items-center gap-2 text-xs text-[var(--orbit-blue)] font-medium uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5" /> Daily Pulse
        </div>
        <h2 className="mt-1.5 text-lg font-semibold tracking-tight">{active.length} things need your attention today</h2>
        <p className="text-sm text-muted-foreground mt-1">Tap to review what matters.</p>
        <div className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[var(--orbit-blue)]">
          Review Today <ChevronRight className="h-3.5 w-3.5" />
        </div>
      </button>

      {/* Smart Actions */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">Smart Actions</h3>
          <Link to="/feed" className="text-xs text-muted-foreground hover:text-foreground">View all</Link>
        </div>
        <ul className="space-y-2.5">
          {top.map((it) => (
            <li key={it.id}>
              <Link
                to="/items/$id"
                params={{ id: it.id }}
                className="block rounded-2xl bg-surface ring-1 ring-border p-4 hover:bg-surface-2 transition active:scale-[0.99]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <CategoryChip value={it.category} />
                      <PriorityChip value={it.priority} />
                    </div>
                    <p className="font-medium tracking-tight truncate">{it.title}</p>
                    {it.summary && <p className="text-xs text-muted-foreground mt-0.5 truncate">{it.summary}</p>}
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Can wait */}
      {canWait.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold mb-3">Can wait</h3>
          <ul className="rounded-2xl bg-surface ring-1 ring-border divide-y divide-border overflow-hidden">
            {canWait.map((it) => (
              <li key={it.id}>
                <Link to="/items/$id" params={{ id: it.id }} className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-surface-2 transition">
                  <div className="min-w-0 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: `var(--cat-${it.category})` }} />
                    <span className="text-sm truncate">{it.title}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <QuickProfilePanel open={qp} onClose={() => setQp(false)} />
    </div>
  );
}
