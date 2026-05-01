import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { ScreenHeader } from "@/components/orbit/AppFrame";
import { useOrbit } from "@/lib/orbit-store";
import { CategoryChip } from "@/components/orbit/Chips";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CATEGORY_LABEL, type Category } from "@/lib/orbit-types";

export const Route = createFileRoute("/_app/memory")({ component: Memory });

function Memory() {
  const { state } = useOrbit();
  const [q, setQ] = React.useState("");
  const [tag, setTag] = React.useState<Category | "all">("all");

  const filtered = state.items.filter((i) => {
    const matchQ = !q || (i.title + " " + (i.summary ?? "")).toLowerCase().includes(q.toLowerCase());
    const matchT = tag === "all" || i.category === tag;
    return matchQ && matchT;
  });

  return (
    <div>
      <ScreenHeader title="Memory" />
      <div className="px-5 pt-4 space-y-4 pb-10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search memory…" className="pl-9 h-11 bg-surface" />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {(["all", ...Object.keys(CATEGORY_LABEL)] as ("all" | Category)[]).map((t) => (
            <button
              key={t}
              onClick={() => setTag(t)}
              className={
                "px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition " +
                (tag === t ? "bg-primary text-primary-foreground" : "bg-surface ring-1 ring-border text-muted-foreground hover:text-foreground")
              }
            >
              {t === "all" ? "All" : CATEGORY_LABEL[t]}
            </button>
          ))}
        </div>
        <ul className="space-y-2">
          {filtered.map((i) => (
            <li key={i.id}>
              <a href={`/items/${i.id}`} className="block rounded-2xl bg-surface ring-1 ring-border p-4 hover:bg-surface-2 transition">
                <div className="flex items-center gap-1.5 mb-1.5"><CategoryChip value={i.category} /></div>
                <p className="font-medium tracking-tight">{i.title}</p>
                {i.summary && <p className="text-xs text-muted-foreground mt-0.5">{i.summary}</p>}
              </a>
            </li>
          ))}
          {filtered.length === 0 && <li className="text-sm text-muted-foreground text-center py-12">Nothing in memory yet.</li>}
        </ul>
      </div>
    </div>
  );
}
