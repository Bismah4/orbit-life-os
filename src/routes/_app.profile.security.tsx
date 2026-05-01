import { createFileRoute } from "@tanstack/react-router";
import { ScreenHeader } from "@/components/orbit/AppFrame";
import { useOrbit } from "@/lib/orbit-store";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/profile/security")({ component: Security });

function Security() {
  const { state, setSecurity } = useOrbit();
  return (
    <div>
      <ScreenHeader title="Security" back="/profile" />
      <div className="px-5 pt-5 pb-10 space-y-3">
        <button onClick={() => toast("Password reset link sent")} className="w-full rounded-2xl bg-surface ring-1 ring-border px-4 py-4 text-left hover:bg-surface-2 transition">
          <p className="text-sm font-medium">Change password</p>
          <p className="text-xs text-muted-foreground">Send a reset link to your email</p>
        </button>
        <Row label="Biometric unlock" sub="Face ID / Touch ID" checked={state.security.biometric} onChange={(v) => { setSecurity({ biometric: v }); toast.success(`Biometrics ${v ? "on" : "off"}`); }} />
        <Row label="Two-factor (2FA)" sub="Authenticator app" checked={state.security.twoFA} onChange={(v) => { setSecurity({ twoFA: v }); toast.success(`2FA ${v ? "on" : "off"}`); }} />
        <Button variant="outline" className="w-full bg-surface mt-4" onClick={() => toast("Sessions cleared")}>Sign out other sessions</Button>
      </div>
    </div>
  );
}

function Row({ label, sub, checked, onChange }: { label: string; sub: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-surface ring-1 ring-border px-4 py-3.5">
      <div><p className="text-sm font-medium">{label}</p><p className="text-xs text-muted-foreground">{sub}</p></div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
