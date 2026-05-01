import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { useOrbit } from "@/lib/orbit-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/login")({ component: Login });

function Login() {
  const { signIn } = useOrbit();
  const nav = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    signIn();
    toast.success("Welcome back");
    nav({ to: "/home" });
  };
  const social = (provider: string) => {
    setLoading(true);
    setTimeout(() => { signIn(); toast.success(`Signed in with ${provider}`); nav({ to: "/home" }); }, 500);
  };

  return (
    <>
      <div className="mt-2 mb-10">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[var(--orbit-blue)] to-[oklch(0.55_0.18_265)] grid place-items-center orbit-glow mb-6">
          <div className="h-4 w-4 rounded-full bg-background/40 ring-2 ring-white/30" />
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground mt-1">Sign in to your Orbit.</p>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-1.5">
          <Label>Email</Label>
          <Input type="email" required defaultValue="alex@orbit.app" className="h-11 bg-surface" />
        </div>
        <div className="space-y-1.5">
          <Label>Password</Label>
          <Input type="password" required defaultValue="••••••••" className="h-11 bg-surface" />
        </div>
        <div className="flex justify-end">
          <Link to="/auth/forgot" className="text-xs text-muted-foreground hover:text-foreground">Forgot password?</Link>
        </div>
        <Button type="submit" disabled={loading} className="w-full h-12 rounded-full orbit-glow">
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3 text-[11px] uppercase tracking-widest text-muted-foreground">
        <div className="flex-1 h-px bg-border" /> or <div className="flex-1 h-px bg-border" />
      </div>

      <div className="space-y-3">
        <Button variant="outline" onClick={() => social("Google")} className="w-full h-12 rounded-full bg-surface">
          Continue with Google
        </Button>
        <Button variant="outline" onClick={() => social("Apple")} className="w-full h-12 rounded-full bg-surface">
          Continue with Apple
        </Button>
      </div>

      <p className="mt-auto pt-8 text-center text-sm text-muted-foreground">
        New to Orbit? <Link to="/auth/signup" className="text-foreground font-medium">Create account</Link>
      </p>
    </>
  );
}
