import { useSessionMonitor } from "../hooks/use-session-monitor";

export function SessionMonitor({
  isAuthenticated,
  onExpired,
}: {
  isAuthenticated: boolean;
  onExpired: () => void;
}) {
  useSessionMonitor({ isAuthenticated, onExpired });
  return null;
}
