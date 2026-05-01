import { createFileRoute } from "@tanstack/react-router";
import { ScreenHeader } from "@/components/orbit/AppFrame";

export const Route = createFileRoute("/_app/profile/privacy")({ component: Privacy });

function Privacy() {
  return (
    <div>
      <ScreenHeader title="Privacy policy" back="/profile" />
      <div className="px-5 pt-5 pb-10 space-y-3 text-sm text-muted-foreground leading-relaxed">
        <p>Orbit is built privacy-first. Captures stay on your device unless you opt in to sync.</p>
        <p>We never sell your data. AI inference happens with on-device first, falling back to your private cloud only when needed.</p>
        <p>You can export or delete your data at any time from Settings.</p>
      </div>
    </div>
  );
}
