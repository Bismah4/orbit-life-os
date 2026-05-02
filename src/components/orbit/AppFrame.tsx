import * as React from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Home, Inbox, Brain, Plus, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/** Mobile-app-width container. All overlays must be portaled inside this width. */
export function AppFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex justify-center bg-background">
      <div
        id="orbit-app"
        className="relative w-full max-w-[440px] min-h-screen bg-background overflow-x-hidden flex flex-col shadow-[0_0_120px_-30px_var(--orbit-glow)]"
      >
        {children}
      </div>
    </div>
  );
}

type NavItem = { to: "/home" | "/feed" | "/capture" | "/memory" | "/profile"; label: string; icon: React.ElementType; primary?: boolean };
const NAV: NavItem[] = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/feed", label: "Feed", icon: Inbox },
  { to: "/capture", label: "", icon: Plus, primary: true },
  { to: "/memory", label: "Memory", icon: Brain },
  { to: "/profile", label: "Profile", icon: UserIcon },
];

export function BottomNav() {
  const loc = useLocation();
  return (
    <nav className="sticky bottom-0 z-30 border-t border-border bg-background/85 backdrop-blur-xl pb-[max(env(safe-area-inset-bottom),8px)] pt-2 px-3">
      <ul className="grid grid-cols-5 items-end">
        {NAV.map((n) => {
          const Icon = n.icon;
          const active = loc.pathname.startsWith(n.to);
          if (n.primary) {
            return (
              <li key={n.to} className="flex justify-center -mt-7">
                <Link
                  to={n.to}
                  className="grid place-items-center h-14 w-14 rounded-full bg-primary text-primary-foreground orbit-glow active:scale-95 transition"
                  aria-label="Capture"
                >
                  <Icon className="h-6 w-6" />
                </Link>
              </li>
            );
          }
          return (
            <li key={n.to}>
              <Link
                to={n.to}
                className={cn(
                  "flex flex-col items-center gap-1 py-1.5 text-[10.5px] font-medium transition-colors",
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className={cn("h-5 w-5", active && "text-primary")} />
                {n.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function ScreenHeader({
  title,
  back,
  right,
}: {
  title: string;
  back?: string;
  right?: React.ReactNode;
}) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-2 px-4 h-14 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="flex items-center gap-2 min-w-0">
        {back && (
          <Link to={back} className="text-sm text-muted-foreground hover:text-foreground">
            ←
          </Link>
        )}
        <h1 className="text-base font-semibold tracking-tight truncate">{title}</h1>
      </div>
      {right}
    </header>
  );
}
