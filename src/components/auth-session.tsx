import { useNavigate } from "@tanstack/react-router";
import { SessionMonitor } from "@/shared";
import { useAuth } from "@/lib/auth";

export function AuthSessionWatcher() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <SessionMonitor
      isAuthenticated={!!user}
      onExpired={() => {
        logout();
        navigate({ to: "/login" });
      }}
    />
  );
}
