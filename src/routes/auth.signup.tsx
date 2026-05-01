import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { useOrbit } from "@/lib/orbit-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/signup")({ component: Signup });

function Signup() {
  const { signIn, setUser, completeOnboarding } = useOrbit();
  const nav = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget as HTMLFormElement);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setUser({ name: String(fd.get("name") || "You"), email: String(fd.get("email") || "") });
    completeOnboarding();
    signIn();
    toast.success("Account created");
    nav({ to: "/home" });
  };

  return (
    <>
      <div className="mt-2 mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">Create your Orbit</h1>
        <p className="text-sm text-muted-foreground mt-1">Start organizing your life in seconds.</p>
      </div>
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-1.5"><Label>Name</Label><Input name="name" required className="h-11 bg-surface" /></div>
        <div className="space-y-1.5"><Label>Email</Label><Input name="email" type="email" required className="h-11 bg-surface" /></div>
        <div className="space-y-1.5"><Label>Password</Label><Input name="password" type="password" required className="h-11 bg-surface" /></div>
        <Button type="submit" disabled={loading} className="w-full h-12 rounded-full orbit-glow">
          {loading ? "Creating…" : "Create account"}
        </Button>
      </form>
      <p className="mt-auto pt-8 text-center text-sm text-muted-foreground">
        Already have an account? <Link to="/auth/login" className="text-foreground font-medium">Sign in</Link>
      </p>
    </>
  );
}
