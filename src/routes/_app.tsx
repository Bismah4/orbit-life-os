import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppFrame, BottomNav } from "@/components/orbit/AppFrame";

export const Route = createFileRoute("/_app")({
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("orbit-state-v1");
      const s = raw ? JSON.parse(raw) : null;
      if (!s?.hasOnboarded) throw redirect({ to: "/onboarding" });
      if (!s?.isAuthed) throw redirect({ to: "/auth/login" });
    } catch (e) {
      if ((e as { isRedirect?: boolean })?.isRedirect) throw e;
    }
  },
  component: AppLayout,
});

function AppLayout() {
  return (
    <AppFrame>
      <main className="flex-1 overflow-y-auto pb-2">
        <Outlet />
      </main>
      <BottomNav />
    </AppFrame>
  );
}
