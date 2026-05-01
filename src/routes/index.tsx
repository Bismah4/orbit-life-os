import { createFileRoute, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { useOrbit } from "@/lib/orbit-store";

export const Route = createFileRoute("/")({ component: SplashRoute });

function SplashRoute() {
  const nav = useNavigate();
  const { state } = useOrbit();

  React.useEffect(() => {
    const t = setTimeout(() => {
      if (!state.hasOnboarded) nav({ to: "/onboarding" });
      else if (!state.isAuthed) nav({ to: "/auth/login" });
      else nav({ to: "/home" });
    }, 1700);
    return () => clearTimeout(t);
  }, [nav, state.hasOnboarded, state.isAuthed]);

  return (
    <div className="orbit-bg-radial min-h-screen flex flex-col items-center justify-center text-center px-8 relative overflow-hidden">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-[var(--orbit-blue)] opacity-30 blur-3xl pulse-ring" />
        <div className="absolute inset-0 rounded-full bg-[var(--orbit-blue)] opacity-20 blur-2xl pulse-ring" style={{ animationDelay: "0.6s" }} />
        <div className="relative h-24 w-24 rounded-full bg-gradient-to-br from-[var(--orbit-blue)] to-[oklch(0.55_0.18_265)] grid place-items-center orbit-glow">
          <div className="h-10 w-10 rounded-full bg-background/30 ring-2 ring-background/60 backdrop-blur-sm relative">
            <span className="absolute -top-1 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-white shadow-[0_0_12px_4px_rgba(255,255,255,0.7)]" />
          </div>
        </div>
      </div>
      <h1 className="mt-10 text-4xl font-semibold tracking-tight fade-up">Orbit</h1>
      <p className="mt-2 text-sm text-muted-foreground fade-up" style={{ animationDelay: "0.15s" }}>
        Your life, organized.
      </p>
    </div>
  );
}
