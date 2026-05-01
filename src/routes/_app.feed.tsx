import { createFileRoute, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { ScreenHeader } from "@/components/orbit/AppFrame";
import { useOrbit } from "@/lib/orbit-store";
import { CategoryChip, PriorityChip } from "@/components/orbit/Chips";
import { ChevronRight, Check } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import type { Category } from "@/lib/orbit-types";

export const Route = createFileRoute("/_app/feed")({ component: Feed });

const FILTERS: { v: "all" | "urgent" | Category; label: string }[] = [
  { v: "all", label: "All" },
  { v: "urgent", label: "Urgent" },
  { v: "money", label: "Money" },
  { v: "work", label: "Work" },
  { v: "admin", label: "Admin" },
  { v: "people", label: "People" },
];

function Feed() {
  const { state, markDone } = useOrbit();
  const nav = useNavigate();
  const [filter, setFilter] = React.useState<typeof FILTERS[number]["v"]>("all");

  const needsAction = state.items.filter((i) => !i.completedAt);
  const completed = state.items.filter((i) => !!i.completedAt);

  const filtered = needsAction.filter((i) => {
    if (filter === "all") return true;
    if (filter === "urgent") return i.priority === "high";
    return i.category === filter;
  });

  return (
    <div>
      <ScreenHeader title="Feed" />
      <div className="px-5 pt-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
        {FILTERS.map((f) => (
          <button
            key={f.v}
            onClick={() => setFilter(f.v)}
            className={
              "px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition " +
              (filter === f.v ? "bg-primary text-primary-foreground" : "bg-surface ring-1 ring-border text-muted-foreground hover:text-foreground")
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      <Tabs defaultValue="needs" className="px-5 pt-2">
        <TabsList className="grid grid-cols-2 bg-surface">
          <TabsTrigger value="needs">Needs Action ({filtered.length})</TabsTrigger>
          <TabsTrigger value="done">Completed ({completed.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="needs" className="space-y-2.5 mt-4">
          {filtered.length === 0 && <Empty msg="All clear. ✨" />}
          {filtered.map((it) => (
            <div key={it.id} className="rounded-2xl bg-surface ring-1 ring-border p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-1.5">
                  <CategoryChip value={it.category} />
                  <PriorityChip value={it.priority} />
                </div>
              </div>
              <p className="font-medium tracking-tight">{it.title}</p>
              {it.summary && <p className="text-xs text-muted-foreground mt-0.5">{it.summary}</p>}
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={() => { markDone(it.id); toast.success("Marked done"); }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-primary/15 text-primary hover:bg-primary/25 transition"
                >
                  <Check className="h-3.5 w-3.5" /> Mark done
                </button>
                <button
                  onClick={() => nav({ to: "/items/$id", params: { id: it.id } })}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-full bg-surface-2 ring-1 ring-border hover:bg-accent transition"
                >
                  Open <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="done" className="space-y-2.5 mt-4">
          {completed.length === 0 && <Empty msg="Nothing completed yet." />}
          {completed.map((it) => (
            <div key={it.id} className="rounded-2xl bg-surface/60 ring-1 ring-border p-4 opacity-80">
              <div className="flex items-center gap-1.5 mb-1.5">
                <CategoryChip value={it.category} />
                <span className="text-[10.5px] uppercase tracking-wider text-muted-foreground">
                  Done · {new Date(it.completedAt!).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                </span>
              </div>
              <p className="font-medium line-through decoration-muted-foreground/50">{it.title}</p>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Empty({ msg }: { msg: string }) {
  return <div className="text-sm text-muted-foreground text-center py-12">{msg}</div>;
}
