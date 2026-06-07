import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { authenticateSupport, DEMO_SUPPORT_HINT } from "@/lib/support-credentials";
import { notify, MESSAGES } from "@/shared";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in · Real Bounty Support" }] }),
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("aarav");
  const [password, setPassword] = useState("support123");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) return notify.error(MESSAGES.ERROR.REQUIRED_FIELD);

    const account = authenticateSupport(identifier, password);
    if (!account) return notify.error(MESSAGES.ERROR.INVALID_CREDENTIALS);

    login({
      id: account.id,
      name: account.name,
      email: account.email,
      username: account.username,
      role: account.role,
    });
    notify.success(`${MESSAGES.SUCCESS.LOGIN} ${account.name}`);
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-accent/40 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-2xl font-bold text-primary-foreground shadow-lg shadow-primary/20">
            N
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">Real Bounty Support</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Internal support console — sign in to continue
            </p>
          </div>
        </div>

        <Card className="p-6">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
            <ShieldCheck className="h-3.5 w-3.5" />
            Support Agent Access
          </div>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="identifier">Email or username</Label>
              <Input
                id="identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="aarav@realbounty.com or aarav"
                required
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </form>
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">{DEMO_SUPPORT_HINT}</p>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Real Bounty Internal Support Console · v1.0
        </p>
      </div>
    </div>
  );
}
