import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ScreenHeader } from "@/components/orbit/AppFrame";
import { useOrbit } from "@/lib/orbit-store";
import { ChevronRight, User as UserIcon, Link2, Shield, Clock, Bell, HelpCircle, FileText, LogOut, Edit2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/profile/")({ component: Profile });

function Profile() {
  const { state, signOut } = useOrbit();
  const nav = useNavigate();

  const rows = [
    { to: "/profile/personal", icon: UserIcon, label: "Personal info", sub: state.user.email },
    { to: "/profile/connected", icon: Link2, label: "Connected accounts", sub: `${[state.connectedAccounts.google && "Google", state.connectedAccounts.apple && "Apple"].filter(Boolean).join(", ") || "None"}` },
    { to: "/profile/security", icon: Shield, label: "Security", sub: state.security.twoFA ? "2FA on" : "2FA off" },
    { to: "/profile/pulse-time", icon: Clock, label: "Daily Pulse time", sub: state.prefs.dailyPulseTime },
    { to: "/profile/reminder-style", icon: Bell, label: "Reminder style", sub: state.prefs.reminderStyle },
    { to: "/profile/support", icon: HelpCircle, label: "Support" },
    { to: "/profile/privacy", icon: FileText, label: "Privacy policy" },
    { to: "/profile/terms", icon: FileText, label: "Terms" },
  ] as const;

  return (
    <div>
      <ScreenHeader title="Profile" />
      <div className="px-5 pt-5 pb-10 space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-[var(--orbit-blue)] to-[oklch(0.55_0.18_265)] grid place-items-center text-lg font-semibold ring-1 ring-white/10">
            {state.user.name[0]}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold truncate">{state.user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{state.user.email}</p>
          </div>
          <Link
            to="/profile/personal"
            className="inline-flex items-center gap-1.5 px-3 h-9 rounded-full bg-surface ring-1 ring-border text-xs font-medium hover:bg-surface-2 transition"
          >
            <Edit2 className="h-3.5 w-3.5" /> Edit
          </Link>
        </div>

        <ul className="rounded-2xl bg-surface ring-1 ring-border divide-y divide-border overflow-hidden">
          {rows.map(({ to, icon: Icon, label, sub }) => (
            <li key={to}>
              <Link to={to} className="flex items-center gap-3 px-4 py-3.5 hover:bg-surface-2 transition">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{label}</p>
                  {sub && <p className="text-xs text-muted-foreground truncate">{sub}</p>}
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </li>
          ))}
        </ul>

        <button
          onClick={() => { signOut(); toast.success("Signed out"); nav({ to: "/auth/login" }); }}
          className="w-full inline-flex items-center justify-center gap-2 h-12 rounded-full bg-surface ring-1 ring-border hover:bg-surface-2 transition text-sm font-medium"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>
    </div>
  );
}
