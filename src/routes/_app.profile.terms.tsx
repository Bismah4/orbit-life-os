import { createFileRoute } from "@tanstack/react-router";
import { ScreenHeader } from "@/components/orbit/AppFrame";

export const Route = createFileRoute("/_app/profile/terms")({ component: Terms });

function Terms() {
  return (
    <div>
      <ScreenHeader title="Terms" back="/profile" />
      <div className="px-5 pt-5 pb-10 space-y-3 text-sm text-muted-foreground leading-relaxed">
        <p>By using Orbit you agree to our terms of service.</p>
        <p>Orbit Premium is billed monthly or annually and can be cancelled anytime.</p>
        <p>Use Orbit responsibly. Do not capture content you don't have rights to.</p>
      </div>
    </div>
  );
}
