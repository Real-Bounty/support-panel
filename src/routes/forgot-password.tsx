import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { createPasswordResetToken, DEMO_SUPPORT_HINT } from "@/lib/support-credentials";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { notify, MESSAGES } from "@/shared";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Forgot password · Real Bounty Support" }] }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState("");
  const [resetLink, setResetLink] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return notify.error(MESSAGES.ERROR.REQUIRED_FIELD);

    const token = createPasswordResetToken(identifier);
    setSubmitted(true);

    if (!token) {
      notify.info(MESSAGES.SUCCESS.RESET_LINK);
      return;
    }

    const link = `${window.location.origin}/reset-password?token=${encodeURIComponent(token)}`;
    setResetLink(link);
    notify.success(MESSAGES.SUCCESS.DEMO_RESET_LINK);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-accent/40 px-4">
      <div className="w-full max-w-md">
        <Card className="p-6 space-y-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-primary" />
            <h1 className="text-xl font-semibold">Forgot password</h1>
          </div>
          {!submitted ? (
            <form onSubmit={onSubmit} className="space-y-4">
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
              <Button type="submit" className="w-full">Send reset link</Button>
            </form>
          ) : (
            <div className="rounded-lg border bg-muted/40 p-4 text-sm space-y-2">
              <p className="text-muted-foreground">{MESSAGES.SUCCESS.RESET_LINK}</p>
              {resetLink && (
                <a href={resetLink} className="text-primary text-sm break-all hover:underline">
                  {resetLink}
                </a>
              )}
            </div>
          )}
          <div className="text-center">
            <Link to="/login" className="text-sm text-primary hover:underline">Back to sign in</Link>
          </div>
        </Card>
        <p className="mt-6 text-center text-xs text-muted-foreground">{DEMO_SUPPORT_HINT}</p>
      </div>
    </div>
  );
}
