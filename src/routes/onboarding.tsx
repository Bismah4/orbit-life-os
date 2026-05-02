import { createFileRoute, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { useOrbit } from "@/lib/orbit-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({ component: Onboarding });

const SLIDES = [
  {
    title: "Capture anything",
    sub: "Drop screenshots, voice, notes, or tasks.",
    visual: <CaptureVisual />,
  },
  {
    title: "Let Orbit think",
    sub: "Orbit turns chaos into clear action.",
    visual: <ThinkVisual />,
  },
  {
    title: "Focus on what matters",
    sub: "Orbit shows only what needs attention today.",
    visual: <FocusVisual />,
  },
  {
    title: "Life, under control",
    sub: "One place for everything important.",
    visual: <ControlVisual />,
  },
];

function Onboarding() {
  const [i, setI] = React.useState(0);
  const nav = useNavigate();
  const { state, completeOnboarding } = useOrbit();

  const finish = () => {
    completeOnboarding();
    // If they're already authed (e.g. just signed up), drop them into the app.
    nav({ to: state.isAuthed ? "/home" : "/auth/login" });
  };
  const next = () => {
    if (i < SLIDES.length - 1) setI(i + 1);
    else finish();
  };
  const skip = () => finish();
  const slide = SLIDES[i];

  return (
    <div className="orbit-bg-radial min-h-screen flex flex-col px-6 pt-6 pb-10 max-w-[440px] mx-auto">
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium tracking-widest text-muted-foreground">ORBIT</div>
        <button onClick={skip} className="text-sm text-muted-foreground hover:text-foreground transition">
          Skip
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div key={i} className="w-full fade-up">
          <div className="mx-auto mb-12 h-64 w-64 grid place-items-center">{slide.visual}</div>
          <h2 className="text-3xl font-semibold tracking-tight">{slide.title}</h2>
          <p className="mt-3 text-[15px] text-muted-foreground max-w-xs mx-auto">{slide.sub}</p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-1.5 mb-8">
        {SLIDES.map((_, idx) => (
          <span
            key={idx}
            className={cn(
              "h-1.5 rounded-full transition-all",
              idx === i ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30"
            )}
          />
        ))}
      </div>

      <Button onClick={next} className="h-12 rounded-full text-[15px] font-medium orbit-glow">
        {i < SLIDES.length - 1 ? "Continue" : "Get Started"}
      </Button>
    </div>
  );
}

/* ----- Premium abstract visuals (no external assets) ----- */

function GlowDisk({ className = "" }: { className?: string }) {
  return <div className={cn("absolute inset-0 rounded-full bg-[var(--orbit-blue)] opacity-20 blur-3xl", className)} />;
}

function CaptureVisual() {
  return (
    <div className="relative h-full w-full">
      <GlowDisk />
      <div className="absolute inset-0 grid place-items-center">
        <div className="relative h-44 w-44">
          <div className="absolute -top-2 -left-4 w-32 h-20 rounded-2xl bg-surface ring-1 ring-border rotate-[-8deg] p-3 shadow-2xl">
            <div className="h-2 w-16 bg-muted-foreground/30 rounded mb-1.5" />
            <div className="h-2 w-20 bg-muted-foreground/20 rounded" />
          </div>
          <div className="absolute top-6 right-0 w-32 h-20 rounded-2xl bg-surface-2 ring-1 ring-border rotate-[6deg] p-3 shadow-2xl">
            <div className="flex gap-1.5 mb-2"><div className="h-2 w-2 rounded-full bg-[var(--pri-high)]" /><div className="h-2 w-12 bg-muted-foreground/30 rounded" /></div>
            <div className="h-2 w-16 bg-muted-foreground/20 rounded" />
          </div>
          <div className="absolute bottom-0 left-6 w-36 h-20 rounded-2xl bg-gradient-to-br from-[var(--orbit-blue)]/30 to-transparent ring-1 ring-[var(--orbit-blue)]/40 rotate-[-3deg] p-3 backdrop-blur-sm shadow-2xl">
            <div className="h-2 w-20 bg-foreground/40 rounded mb-1.5" />
            <div className="h-2 w-24 bg-foreground/20 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ThinkVisual() {
  return (
    <div className="relative h-full w-full">
      <GlowDisk />
      <div className="absolute inset-0 grid place-items-center">
        <div className="relative h-40 w-40">
          <div className="absolute inset-0 rounded-full ring-1 ring-border animate-[spin_18s_linear_infinite]" />
          <div className="absolute inset-3 rounded-full ring-1 ring-border/70 animate-[spin_24s_linear_infinite_reverse]" />
          <div className="absolute inset-8 rounded-full ring-1 ring-border/50" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-3 w-3 rounded-full bg-[var(--orbit-blue)] orbit-glow" />
          <div className="absolute bottom-2 right-2 h-2 w-2 rounded-full bg-[var(--pri-med)]" />
          <div className="absolute bottom-4 left-2 h-2 w-2 rounded-full bg-[var(--cat-money)]" />
          <div className="absolute inset-0 grid place-items-center">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[var(--orbit-blue)] to-[oklch(0.55_0.18_265)] grid place-items-center orbit-glow">
              <div className="h-3 w-3 rounded-full bg-white shadow-[0_0_8px_2px_rgba(255,255,255,0.7)]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FocusVisual() {
  return (
    <div className="relative h-full w-full">
      <GlowDisk />
      <div className="absolute inset-0 grid place-items-center">
        <div className="w-56 space-y-2">
          <div className="rounded-xl bg-gradient-to-r from-[var(--orbit-blue)]/25 to-transparent ring-1 ring-[var(--orbit-blue)]/40 p-3 shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-1.5 w-1.5 rounded-full bg-[var(--pri-high)]" />
              <div className="h-2 w-24 bg-foreground/50 rounded" />
            </div>
            <div className="h-2 w-32 bg-foreground/25 rounded" />
          </div>
          <div className="rounded-xl bg-surface ring-1 ring-border p-3 opacity-70">
            <div className="h-2 w-20 bg-muted-foreground/40 rounded mb-1.5" />
            <div className="h-2 w-28 bg-muted-foreground/25 rounded" />
          </div>
          <div className="rounded-xl bg-surface ring-1 ring-border p-3 opacity-40">
            <div className="h-2 w-16 bg-muted-foreground/40 rounded mb-1.5" />
            <div className="h-2 w-24 bg-muted-foreground/25 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ControlVisual() {
  const cats = [
    { c: "var(--cat-money)" }, { c: "var(--cat-work)" }, { c: "var(--cat-admin)" },
    { c: "var(--cat-health)" }, { c: "var(--cat-people)" }, { c: "var(--cat-goals)" },
  ];
  return (
    <div className="relative h-full w-full">
      <GlowDisk />
      <div className="absolute inset-0 grid place-items-center">
        <div className="grid grid-cols-3 gap-3">
          {cats.map((x, i) => (
            <div key={i} className="h-16 w-16 rounded-2xl bg-surface ring-1 ring-border grid place-items-center shadow-xl">
              <div className="h-6 w-6 rounded-lg" style={{ background: `color-mix(in oklab, ${x.c} 35%, transparent)`, boxShadow: `0 0 18px 0 ${x.c}` }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
