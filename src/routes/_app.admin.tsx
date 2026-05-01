import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { ScreenHeader } from "@/components/orbit/AppFrame";
import { useOrbit } from "@/lib/orbit-store";
import { CategoryChip, PriorityChip } from "@/components/orbit/Chips";
import { ChevronRight, MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/admin")({ component: AdminModule });

const BUCKETS = [
  { key: "bills", label: "Bills" },
  { key: "documents", label: "Documents" },
  { key: "renewals", label: "Renewals" },
  { key: "subscriptions", label: "Subscriptions" },
] as const;

type BucketKey = typeof BUCKETS[number]["key"];

function bucketFor(title: string, summary?: string): BucketKey {
  const t = (title + " " + (summary ?? "")).toLowerCase();
  if (/(bill|invoice|payment|due|\$|charge)/.test(t)) return "bills";
  if (/(passport|license|renew|expir)/.test(t)) return "renewals";
  if (/(subscription|netflix|spotify|plan)/.test(t)) return "subscriptions";
  return "documents";
}

function AdminModule() {
  const { state } = useOrbit();
  const nav = useNavigate();

  const adminItems = state.items.filter((i) => i.category === "admin" || /(bill|invoice|passport|renew|subscription|document)/i.test(i.title));
  const counts: Record<BucketKey, number> = { bills: 0, documents: 0, renewals: 0, subscriptions: 0 };
  adminItems.forEach((i) => { counts[bucketFor(i.title, i.summary)]++; });

  const delayed = state.items.filter((i) => !i.completedAt && i.priority !== "low").slice(0, 4);

  return (
    <div>
      <ScreenHeader
        title="Admin"
        back="/home"
        right={
          <DropdownMenu>
            <DropdownMenuTrigger className="h-9 w-9 grid place-items-center rounded-full hover:bg-surface transition">
              <MoreVertical className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover">
              <DropdownMenuItem onClick={() => nav({ to: "/capture" })}>Add admin task</DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast("Sorted by priority")}>Sort</DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast("Filters applied")}>Filter</DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.success("Exported (mock)")}>Export</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />
      <div className="px-5 pt-5 pb-10 space-y-6">
        <div className="grid grid-cols-2 gap-3">
          {BUCKETS.map((b) => (
            <Link
              key={b.key}
              to="/admin/$bucket"
              params={{ bucket: b.key }}
              className="rounded-2xl bg-surface ring-1 ring-border p-4 hover:bg-surface-2 transition"
            >
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{b.label}</p>
              <p className="text-3xl font-semibold mt-1">{counts[b.key]}</p>
              <p className="text-xs text-[var(--orbit-blue)] mt-2 inline-flex items-center gap-1">View list <ChevronRight className="h-3 w-3" /></p>
            </Link>
          ))}
        </div>

        <section>
          <h3 className="text-sm font-semibold mb-3">Delayed</h3>
          <ul className="rounded-2xl bg-surface ring-1 ring-border divide-y divide-border overflow-hidden">
            {delayed.length === 0 && <li className="px-4 py-6 text-center text-sm text-muted-foreground">Nothing delayed.</li>}
            {delayed.map((it) => (
              <li key={it.id}>
                <Link to="/items/$id" params={{ id: it.id }} className="flex items-center gap-3 px-4 py-3.5 hover:bg-surface-2 transition">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5"><CategoryChip value={it.category} /><PriorityChip value={it.priority} /></div>
                    <p className="text-sm font-medium truncate">{it.title}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
