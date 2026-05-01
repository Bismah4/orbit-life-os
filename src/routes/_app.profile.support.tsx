import { createFileRoute } from "@tanstack/react-router";
import { ScreenHeader } from "@/components/orbit/AppFrame";

export const Route = createFileRoute("/_app/profile/support")({ component: Support });

function Support() {
  return (
    <div>
      <ScreenHeader title="Support" back="/profile" />
      <div className="px-5 pt-5 pb-10 space-y-3">
        <a href="mailto:hello@orbit.app" className="block rounded-2xl bg-surface ring-1 ring-border p-4 hover:bg-surface-2 transition">
          <p className="text-sm font-semibold">Contact support</p>
          <p className="text-xs text-muted-foreground mt-0.5">hello@orbit.app · We reply within 24h</p>
        </a>
        <div className="rounded-2xl bg-surface ring-1 ring-border p-4">
          <p className="text-sm font-semibold mb-1">FAQ</p>
          <ul className="text-xs text-muted-foreground space-y-1.5 mt-2 list-disc pl-4">
            <li>How does Orbit understand my input?</li>
            <li>Can I export my data?</li>
            <li>How do I change my reminder style?</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
