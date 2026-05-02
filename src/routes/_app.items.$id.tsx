import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import * as React from "react";
import { ScreenHeader } from "@/components/orbit/AppFrame";
import { useOrbit } from "@/lib/orbit-store";
import { CategoryChip, PriorityChip } from "@/components/orbit/Chips";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Check, Bell, Sparkles, Trash2, MoreVertical } from "lucide-react";
import { ReminderModal } from "@/components/orbit/ReminderModal";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/_app/items/$id")({ component: ItemDetail });

function ItemDetail() {
  const { id } = useParams({ from: "/_app/items/$id" });
  const { state, markDone, discardItem, updateItem } = useOrbit();
  const nav = useNavigate();
  const [remindOpen, setRemindOpen] = React.useState(false);
  const item = state.items.find((i) => i.id === id);

  if (!item) {
    return (
      <div>
        <ScreenHeader title="Not found" back="/feed" />
        <div className="px-5 py-12 text-center text-sm text-muted-foreground">
          This item is gone. <Link to="/feed" className="text-foreground underline">Back to feed</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ScreenHeader
        title="Detail"
        back="/feed"
        right={
          <DropdownMenu>
            <DropdownMenuTrigger className="h-9 w-9 grid place-items-center rounded-full hover:bg-surface transition" aria-label="More">
              <MoreVertical className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover">
              <DropdownMenuItem onClick={() => updateItem(item.id, { priority: "high" })}>Set high priority</DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateItem(item.id, { priority: "med" })}>Set medium</DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateItem(item.id, { priority: "low" })}>Set low</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => { discardItem(item.id); toast("Discarded"); nav({ to: "/feed" }); }}
                className="text-[var(--pri-high)] focus:text-[var(--pri-high)]"
              >
                <Trash2 className="h-4 w-4 mr-2" /> Discard
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />
      <div className="px-5 py-5 space-y-5">
        <div className="flex items-center gap-1.5">
          <CategoryChip value={item.category} />
          <PriorityChip value={item.priority} />
          <span className="ml-auto text-[10.5px] uppercase tracking-wider text-muted-foreground">via {item.source}</span>
        </div>

        {item.preview && item.source === "screenshot" && (
          <img src={item.preview} alt="" className="rounded-2xl ring-1 ring-border max-h-72 w-full object-cover" />
        )}

        <h1 className="text-2xl font-semibold tracking-tight">{item.title}</h1>
        {item.summary && <p className="text-sm text-muted-foreground">{item.summary}</p>}

        {(item.insight || item.suggestedAction) && (
          <div className="rounded-2xl bg-gradient-to-br from-[var(--orbit-blue)]/12 to-transparent ring-1 ring-[var(--orbit-blue)]/25 p-4 space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-[var(--orbit-blue)] font-medium uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" /> Orbit insight
            </div>
            {item.insight && <p className="text-sm">{item.insight}</p>}
            {item.suggestedAction && <p className="text-xs text-muted-foreground"><span className="text-foreground font-medium">Suggested:</span> {item.suggestedAction}</p>}
          </div>
        )}

        {item.completedAt ? (
          <div className="rounded-2xl bg-surface ring-1 ring-border p-4 text-sm">
            ✓ Completed {new Date(item.completedAt).toLocaleString()}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={() => { markDone(item.id); toast.success("Marked done"); nav({ to: "/feed" }); }} className="h-12 rounded-full orbit-glow">
              <Check className="h-4 w-4 mr-1.5" /> Done
            </Button>
            <Button variant="outline" onClick={() => setRemindOpen(true)} className="h-12 rounded-full bg-surface">
              <Bell className="h-4 w-4 mr-1.5" /> Remind
            </Button>
          </div>
        )}

        {item.remindAt && (
          <div className="rounded-2xl bg-surface ring-1 ring-border p-4 text-sm">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Reminder</p>
            <p className="font-medium mt-0.5">{new Date(item.remindAt).toLocaleString()}</p>
          </div>
        )}
      </div>
      <ReminderModal itemId={item.id} title={item.title} open={remindOpen} onClose={() => setRemindOpen(false)} />
    </div>
  );
}
