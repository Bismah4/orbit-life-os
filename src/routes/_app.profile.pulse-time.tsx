import { createFileRoute, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { ScreenHeader } from "@/components/orbit/AppFrame";
import { useOrbit } from "@/lib/orbit-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/profile/pulse-time")({ component: PulseTime });

function PulseTime() {
  const { state, setPrefs } = useOrbit();
  const nav = useNavigate();
  const [t, setT] = React.useState(state.prefs.dailyPulseTime);
  return (
    <div>
      <ScreenHeader title="Daily Pulse time" back="/profile" />
      <div className="px-5 pt-5 pb-10 space-y-4">
        <p className="text-sm text-muted-foreground">When should Orbit deliver your daily summary?</p>
        <Input type="time" value={t} onChange={(e) => setT(e.target.value)} className="h-12 bg-surface text-lg" />
        <Button className="w-full h-12 rounded-full orbit-glow" onClick={() => { setPrefs({ dailyPulseTime: t }); toast.success("Pulse time saved"); nav({ to: "/profile" }); }}>Save</Button>
      </div>
    </div>
  );
}
