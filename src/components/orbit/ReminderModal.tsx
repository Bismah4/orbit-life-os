import * as React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOrbit } from "@/lib/orbit-store";
import { toast } from "sonner";

const PRESETS: { label: string; getDate: () => Date }[] = [
  { label: "In 20 minutes", getDate: () => new Date(Date.now() + 20 * 60 * 1000) },
  { label: "In 1 hour", getDate: () => new Date(Date.now() + 60 * 60 * 1000) },
  { label: "In 3 hours", getDate: () => new Date(Date.now() + 3 * 60 * 60 * 1000) },
  { label: "Tonight at 8 PM", getDate: () => { const d = new Date(); d.setHours(20, 0, 0, 0); if (d < new Date()) d.setDate(d.getDate() + 1); return d; } },
  { label: "Tomorrow morning", getDate: () => { const d = new Date(); d.setDate(d.getDate() + 1); d.setHours(9, 0, 0, 0); return d; } },
];

export function ReminderModal({
  itemId, title, open, onClose,
}: { itemId: string; title: string; open: boolean; onClose: () => void }) {
  const { addReminder } = useOrbit();
  const [custom, setCustom] = React.useState(false);
  const [date, setDate] = React.useState("");
  const [time, setTime] = React.useState("");
  const [confirmed, setConfirmed] = React.useState<Date | null>(null);

  React.useEffect(() => {
    if (!open) { setCustom(false); setConfirmed(null); setDate(""); setTime(""); }
  }, [open]);

  const set = (d: Date) => { addReminder(itemId, d.toISOString()); setConfirmed(d); toast.success("Reminder set"); };

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="bottom" className="mx-auto max-w-[440px] rounded-t-3xl bg-popover border-border p-0 max-h-[88vh] overflow-y-auto">
        <SheetHeader className="px-5 pt-5"><SheetTitle>Remind me</SheetTitle></SheetHeader>
        <div className="px-5 pb-6 pt-3">
          {confirmed ? (
            <div className="text-center py-6">
              <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-primary/15 grid place-items-center text-primary">✓</div>
              <p className="font-semibold">Reminder set for "{title}"</p>
              <p className="text-sm text-muted-foreground mt-1">{confirmed.toLocaleString()}</p>
              <Button onClick={onClose} className="mt-5 h-11 rounded-full px-8">Done</Button>
            </div>
          ) : !custom ? (
            <>
              <ul className="space-y-2">
                {PRESETS.map((p) => (
                  <li key={p.label}>
                    <button
                      onClick={() => set(p.getDate())}
                      className="w-full text-left px-4 py-3 rounded-xl bg-surface ring-1 ring-border hover:bg-surface-2 transition flex items-center justify-between"
                    >
                      <span className="text-sm font-medium">{p.label}</span>
                      <span className="text-xs text-muted-foreground">{p.getDate().toLocaleString([], { weekday: "short", hour: "numeric", minute: "2-digit" })}</span>
                    </button>
                  </li>
                ))}
                <li>
                  <button onClick={() => setCustom(true)} className="w-full text-left px-4 py-3 rounded-xl bg-surface ring-1 ring-border hover:bg-surface-2 transition text-sm font-medium">
                    Custom date & time…
                  </button>
                </li>
              </ul>
            </>
          ) : (
            <div className="space-y-3">
              <div><Label>Date</Label><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-11 bg-surface" /></div>
              <div><Label>Time</Label><Input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="h-11 bg-surface" /></div>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1 bg-surface" onClick={() => setCustom(false)}>Back</Button>
                <Button
                  className="flex-1 orbit-glow"
                  onClick={() => {
                    if (!date || !time) { toast.error("Pick a date and time"); return; }
                    const d = new Date(`${date}T${time}`);
                    if (isNaN(+d)) { toast.error("Invalid date/time"); return; }
                    set(d);
                  }}
                >Set reminder</Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
