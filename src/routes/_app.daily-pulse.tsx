import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ScreenHeader } from "@/components/orbit/AppFrame";
import { useOrbit } from "@/lib/orbit-store";
import { CategoryChip, PriorityChip } from "@/components/orbit/Chips";
import { ChevronRight, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/daily-pulse")({ component: DailyPulse });

function DailyPulse() {
  const { state, markDone } = useOrbit();
  const nav = useNavigate();
  const items = state.items.filter((i) => !i.completedAt);
  const high = items.filter((i) => i.priority === "high");
  const med = items.filter((i) => i.priority === "med");
  const low = items.filter((i) => i.priority === "low");

  const markAll = () => {
    items.forEach((i) => markDone(i.id));
    toast.success(`Cleared ${items.length} item${items.length === 1 ? "" : "s"}`);
    nav({ to: "/home" });
  };

  return (
    <div>
      <ScreenHeader title="Daily Pulse" back="/home" />
      <div className="px-5 pt-5 pb-10 space-y-5">
        <div className="rounded-2xl bg-gradient-to-br from-[var(--orbit-blue)]/15 to-transparent ring-1 ring-[var(--orbit-blue)]/30 p-5">
          <p className="text-xs text-[var(--orbit-blue)] font-medium uppercase tracking-wider">Today</p>
          <h1 className="text-2xl font-semibold tracking-tight mt-1">{items.length} things matter today</h1>
          <p className="text-sm text-muted-foreground mt-1">Orbit triaged these for you. Tap any item to take action.</p>
          {items.length > 0 && (
            <Button onClick={markAll} variant="outline" className="mt-4 h-10 rounded-full bg-surface ring-1 ring-border">
              <CheckCheck className="h-4 w-4 mr-1.5" /> Mark all done
            </Button>
          )}
        </div>

        <Section title="High priority" items={high} />
        <Section title="Medium" items={med} />
        <Section title="Low" items={low} />

        {items.length === 0 && (
          <div className="text-center py-12 text-sm text-muted-foreground">All clear. ✨</div>
        )}
      </div>
    </div>
  );
}

function Section({ title, items }: { title: string; items: ReturnType<typeof useOrbit>["state"]["items"] }) {
  if (items.length === 0) return null;
  return (
    <section>
      <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">{title}</h3>
      <ul className="space-y-2">
        {items.map((it) => (
          <li key={it.id}>
            <Link to="/items/$id" params={{ id: it.id }} className="block rounded-2xl bg-surface ring-1 ring-border p-4 hover:bg-surface-2 transition active:scale-[0.99]">
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
    </section>
  );
}
