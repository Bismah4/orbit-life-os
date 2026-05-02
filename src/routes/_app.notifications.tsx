import { createFileRoute, Link } from "@tanstack/react-router";
import { ScreenHeader } from "@/components/orbit/AppFrame";
import { useOrbit } from "@/lib/orbit-store";
import { CategoryChip, PriorityChip } from "@/components/orbit/Chips";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Bell, X } from "lucide-react";
import { toast } from "sonner";
import * as React from "react";

export const Route = createFileRoute("/_app/notifications")({ component: Notifications });

function Notifications() {
  const { state } = useOrbit();
  const now = Date.now();
  const upcoming = state.reminders.filter((r) => !r.completed && new Date(r.remindAt).getTime() > now);
  const today = upcoming.filter((r) => isSameDay(new Date(r.remindAt), new Date()));
  const later = upcoming.filter((r) => !isSameDay(new Date(r.remindAt), new Date()));
  const completedItems = state.items.filter((i) => !!i.completedAt).slice(0, 50);

  return (
    <div>
      <ScreenHeader title="Notifications" back="/home" />
      <div className="px-5 pt-4 pb-10">
        <Tabs defaultValue="upcoming">
          <TabsList className="grid grid-cols-4 bg-surface text-xs">
            <TabsTrigger value="upcoming">All</TabsTrigger>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="later">Later</TabsTrigger>
            <TabsTrigger value="completed">Done</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming"><ReminderList items={upcoming} empty="No reminders set." /></TabsContent>
          <TabsContent value="today"><ReminderList items={today} empty="Nothing scheduled today." /></TabsContent>
          <TabsContent value="later"><ReminderList items={later} empty="Nothing scheduled later." /></TabsContent>
          <TabsContent value="completed">
            <ul className="mt-4 space-y-2">
              {completedItems.length === 0 && <EmptyState msg="No completed items." />}
              {completedItems.map((i) => (
                <li key={i.id} className="rounded-2xl bg-surface ring-1 ring-border p-4">
                  <div className="flex items-center gap-1.5 mb-1"><CategoryChip value={i.category} /></div>
                  <p className="font-medium line-through decoration-muted-foreground/50">{i.title}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">Done · {new Date(i.completedAt!).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ReminderList({ items, empty }: { items: ReturnType<typeof useOrbit>["state"]["reminders"]; empty: string }) {
  const { updateItem } = useOrbit();
  if (items.length === 0) return <EmptyState msg={empty} />;
  return (
    <ul className="mt-4 space-y-2">
      {items.map((r) => (
        <li key={r.id} className="relative">
          <Link to="/items/$id" params={{ id: r.itemId }} className="block rounded-2xl bg-surface ring-1 ring-border p-4 pr-12 hover:bg-surface-2 transition">
            <div className="flex items-center gap-1.5 mb-1.5">
              <CategoryChip value={r.category} />
              <PriorityChip value={r.priority} />
              <span className="ml-auto text-[10.5px] uppercase tracking-wider text-muted-foreground">{new Date(r.remindAt).toLocaleString([], { weekday: "short", hour: "numeric", minute: "2-digit" })}</span>
            </div>
            <p className="font-medium">{r.title}</p>
          </Link>
          <button
            onClick={(e) => { e.preventDefault(); updateItem(r.itemId, { remindAt: undefined }); toast("Reminder cancelled"); }}
            aria-label="Cancel reminder"
            className="absolute right-3 top-3 h-8 w-8 grid place-items-center rounded-full bg-surface-2 hover:bg-accent text-muted-foreground hover:text-foreground transition"
          >
            <X className="h-4 w-4" />
          </button>
        </li>
      ))}
    </ul>
  );
}

function EmptyState({ msg }: { msg: string }) {
  return (
    <div className="text-center py-14">
      <Bell className="h-8 w-8 mx-auto text-muted-foreground/50 mb-3" />
      <p className="text-sm text-muted-foreground">{msg}</p>
    </div>
  );
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
