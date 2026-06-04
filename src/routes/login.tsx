import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in · NavikX Support" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("aarav@navikx.com");
  const [password, setPassword] = useState("••••••••");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    localStorage.setItem("navikx-auth", "1");
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
            <h1 className="text-2xl font-bold tracking-tight">NavikX Support</h1>
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
              <Label htmlFor="email">Work email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="agent@navikx.com"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
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

        <p className="mt-6 text-center text-xs text-muted-foreground">
          NavikX Internal Support Console · v1.0
        </p>
      </div>
    </div>
  );
}
