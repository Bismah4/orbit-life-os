import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ScreenHeader } from "@/components/orbit/AppFrame";
import { useOrbit } from "@/lib/orbit-store";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/profile/reminder-style")({ component: ReminderStyle });

const STYLES: { v: "gentle" | "standard" | "assertive"; label: string; sub: string }[] = [
  { v: "gentle", label: "Gentle", sub: "Soft nudges, easy to dismiss" },
  { v: "standard", label: "Standard", sub: "Balanced reminders" },
  { v: "assertive", label: "Assertive", sub: "Persistent until acted on" },
];

function ReminderStyle() {
  const { state, setPrefs } = useOrbit();
  const nav = useNavigate();
  return (
    <div>
      <ScreenHeader title="Reminder style" back="/profile" />
      <div className="px-5 pt-5 pb-10 space-y-2">
        {STYLES.map((s) => {
          const sel = state.prefs.reminderStyle === s.v;
          return (
            <button
              key={s.v}
              onClick={() => { setPrefs({ reminderStyle: s.v }); toast.success("Reminder style saved"); nav({ to: "/profile" }); }}
              className={"w-full text-left px-4 py-4 rounded-2xl ring-1 transition " + (sel ? "bg-[var(--orbit-blue)]/15 ring-[var(--orbit-blue)]/40" : "bg-surface ring-border hover:bg-surface-2")}
            >
              <p className="text-sm font-semibold">{s.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
