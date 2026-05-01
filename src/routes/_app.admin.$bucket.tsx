import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ScreenHeader } from "@/components/orbit/AppFrame";
import { useOrbit } from "@/lib/orbit-store";
import { CategoryChip, PriorityChip } from "@/components/orbit/Chips";
import { ChevronRight } from "lucide-react";

export const Route = createFileRoute("/_app/admin/$bucket")({ component: AdminBucket });

const TITLES: Record<string, string> = {
  bills: "Bills", documents: "Documents", renewals: "Renewals", subscriptions: "Subscriptions",
};

function bucketFor(title: string, summary?: string) {
  const t = (title + " " + (summary ?? "")).toLowerCase();
  if (/(bill|invoice|payment|due|\$|charge)/.test(t)) return "bills";
  if (/(passport|license|renew|expir)/.test(t)) return "renewals";
  if (/(subscription|netflix|spotify|plan)/.test(t)) return "subscriptions";
  return "documents";
}

function AdminBucket() {
  const { bucket } = useParams({ from: "/_app/admin/$bucket" });
  const { state } = useOrbit();
  const items = state.items.filter((i) => (i.category === "admin" || /(bill|invoice|passport|renew|subscription|document)/i.test(i.title)) && bucketFor(i.title, i.summary) === bucket);
  return (
    <div>
      <ScreenHeader title={TITLES[bucket] ?? "Items"} back="/admin" />
      <div className="px-5 pt-5 pb-10 space-y-2">
        {items.length === 0 && <p className="text-sm text-muted-foreground text-center py-12">Nothing here yet.</p>}
        {items.map((it) => (
          <Link key={it.id} to="/items/$id" params={{ id: it.id }} className="block rounded-2xl bg-surface ring-1 ring-border p-4 hover:bg-surface-2 transition">
            <div className="flex items-center gap-1.5 mb-1.5"><CategoryChip value={it.category} /><PriorityChip value={it.priority} /></div>
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium truncate">{it.title}</p>
                {it.summary && <p className="text-xs text-muted-foreground truncate">{it.summary}</p>}
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
