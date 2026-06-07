import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { resetPasswordWithToken } from "@/lib/support-credentials";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { notify, MESSAGES } from "@/shared";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Reset password · Real Bounty Support" }] }),
  component: ResetPasswordPage,
  validateSearch: (s: Record<string, unknown>) => ({
    token: typeof s.token === "string" ? s.token : "",
  }),
});

function ResetPasswordPage() {
  const { token } = Route.useSearch();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return notify.error(MESSAGES.ERROR.RESET_TOKEN_MISSING);
    if (password !== confirm) return notify.error(MESSAGES.ERROR.PASSWORD_MISMATCH);

    const result = resetPasswordWithToken(token, password);
    if (!result.ok) return notify.error(result.error);

    notify.success(MESSAGES.SUCCESS.PASSWORD_RESET);
    navigate({ to: "/login" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md p-6 space-y-4">
        <h1 className="text-xl font-semibold">Set new password</h1>
        <form onSubmit={onSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="password">New password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirm">Confirm password</Label>
            <Input id="confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full">Update password</Button>
        </form>
        <Link to="/login" className="text-sm text-primary hover:underline">Back to sign in</Link>
      </Card>
    </div>
  );
}
