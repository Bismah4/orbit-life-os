import { createFileRoute, Link } from "@tanstack/react-router";
import { ScreenHeader } from "@/components/orbit/AppFrame";
import { useOrbit } from "@/lib/orbit-store";
import { CategoryChip, PriorityChip } from "@/components/orbit/Chips";
import { ChevronRight } from "lucide-react";

export const Route = createFileRoute("/_app/daily-pulse")({ component: DailyPulse });

function DailyPulse() {
  const { state } = useOrbit();
  const items = state.items.filter((i) => !i.completedAt);
  return (
    <div>
      <ScreenHeader title="Daily Pulse" back="/home" />
      <div className="px-5 pt-5 pb-10 space-y-4">
        <div className="rounded-2xl bg-gradient-to-br from-[var(--orbit-blue)]/15 to-transparent ring-1 ring-[var(--orbit-blue)]/30 p-5">
          <p className="text-xs text-[var(--orbit-blue)] font-medium uppercase tracking-wider">Today</p>
          <h1 className="text-2xl font-semibold tracking-tight mt-1">{items.length} things matter today</h1>
          <p className="text-sm text-muted-foreground mt-1">Orbit triaged these for you. Tap any item to take action.</p>
        </div>
        <ul className="space-y-2">
          {items.map((it) => (
            <li key={it.id}>
              <Link to="/items/$id" params={{ id: it.id }} className="block rounded-2xl bg-surface ring-1 ring-border p-4 hover:bg-surface-2 transition">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <CategoryChip value={it.category} /><PriorityChip value={it.priority} />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{it.title}</p>
                    {it.summary && <p className="text-xs text-muted-foreground truncate">{it.summary}</p>}
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
