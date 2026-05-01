import { createFileRoute, Link } from "@tanstack/react-router";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/forgot")({ component: Forgot });

function Forgot() {
  const [sent, setSent] = React.useState(false);
  return (
    <>
      <div className="mt-2 mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">Reset password</h1>
        <p className="text-sm text-muted-foreground mt-1">We'll send you a reset link.</p>
      </div>
      {!sent ? (
        <form onSubmit={(e) => { e.preventDefault(); setSent(true); toast.success("Reset link sent"); }} className="space-y-4">
          <div className="space-y-1.5"><Label>Email</Label><Input type="email" required className="h-11 bg-surface" /></div>
          <Button type="submit" className="w-full h-12 rounded-full orbit-glow">Send link</Button>
        </form>
      ) : (
        <div className="rounded-2xl bg-surface ring-1 ring-border p-5 text-sm">
          Check your inbox for a reset link.
        </div>
      )}
      <p className="mt-auto pt-8 text-center text-sm text-muted-foreground">
        <Link to="/auth/login" className="text-foreground font-medium">Back to sign in</Link>
      </p>
    </>
  );
}
