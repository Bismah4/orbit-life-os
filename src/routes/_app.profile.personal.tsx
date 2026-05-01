import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { ScreenHeader } from "@/components/orbit/AppFrame";
import { useOrbit } from "@/lib/orbit-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/profile/personal")({ component: Personal });

function Personal() {
  const { state, setUser } = useOrbit();
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(state.user);

  React.useEffect(() => { if (!editing) setDraft(state.user); }, [editing, state.user]);

  return (
    <div>
      <ScreenHeader
        title="Personal info"
        back="/profile"
        right={!editing ? (
          <button onClick={() => setEditing(true)} className="text-sm text-[var(--orbit-blue)] font-medium">Edit</button>
        ) : null}
      />
      <div className="px-5 pt-5 pb-10 space-y-5">
        <div className="flex items-center gap-3">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[var(--orbit-blue)] to-[oklch(0.55_0.18_265)] grid place-items-center text-xl font-semibold ring-1 ring-white/10">
            {draft.name[0]}
          </div>
          {editing && <button className="text-xs text-muted-foreground underline" onClick={() => toast("Avatar picker coming soon")}>Change avatar</button>}
        </div>

        <div className="space-y-3">
          <Field label="Name" value={draft.name} editing={editing} onChange={(v) => setDraft({ ...draft, name: v })} />
          <Field label="Email" value={draft.email} editing={editing} onChange={(v) => setDraft({ ...draft, email: v })} />
          <Field label="Phone" value={draft.phone} editing={editing} onChange={(v) => setDraft({ ...draft, phone: v })} />
        </div>

        {editing && (
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1 bg-surface" onClick={() => { setEditing(false); setDraft(state.user); }}>Cancel</Button>
            <Button className="flex-1 orbit-glow" onClick={() => { setUser(draft); setEditing(false); toast.success("Profile updated"); }}>Save</Button>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, editing, onChange }: { label: string; value: string; editing: boolean; onChange: (v: string) => void }) {
  return (
    <div>
      <Label>{label}</Label>
      {editing
        ? <Input value={value} onChange={(e) => onChange(e.target.value)} className="h-11 bg-surface mt-1" />
        : <p className="mt-1 px-3 py-3 rounded-md bg-surface ring-1 ring-border text-sm">{value || <span className="text-muted-foreground">—</span>}</p>}
    </div>
  );
}
