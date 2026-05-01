import { createFileRoute } from "@tanstack/react-router";
import { ScreenHeader } from "@/components/orbit/AppFrame";
import { useOrbit } from "@/lib/orbit-store";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/profile/connected")({ component: Connected });

function Connected() {
  const { state, setConnected } = useOrbit();
  const Row = ({ k, label }: { k: "google" | "apple"; label: string }) => {
    const on = state.connectedAccounts[k];
    return (
      <li className="flex items-center justify-between gap-3 px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-surface-2 ring-1 ring-border grid place-items-center text-sm">{label[0]}</div>
          <div>
            <p className="text-sm font-medium">{label}</p>
            <p className="text-xs text-muted-foreground">{on ? "Connected" : "Not connected"}</p>
          </div>
        </div>
        <Button
          variant={on ? "outline" : "default"}
          size="sm"
          className={on ? "bg-surface" : "orbit-glow"}
          onClick={() => { setConnected(k, !on); toast.success(`${label} ${on ? "disconnected" : "connected"}`); }}
        >
          {on ? "Disconnect" : "Connect"}
        </Button>
      </li>
    );
  };
  return (
    <div>
      <ScreenHeader title="Connected accounts" back="/profile" />
      <div className="px-5 pt-5 pb-10">
        <ul className="rounded-2xl bg-surface ring-1 ring-border divide-y divide-border overflow-hidden">
          <Row k="google" label="Google" />
          <Row k="apple" label="Apple" />
        </ul>
      </div>
    </div>
  );
}
