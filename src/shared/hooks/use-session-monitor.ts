import { useEffect } from "react";
import { MESSAGES } from "../messages";
import { notify } from "../notify";

const DEFAULT_TIMEOUT_MS = 8 * 60 * 60 * 1000;
const ACTIVITY_KEY = "realbounty_last_activity";

export function touchSession() {
  if (typeof window !== "undefined") {
    localStorage.setItem(ACTIVITY_KEY, String(Date.now()));
  }
}

export function isSessionExpired(timeoutMs = DEFAULT_TIMEOUT_MS): boolean {
  if (typeof window === "undefined") return false;
  const raw = localStorage.getItem(ACTIVITY_KEY);
  if (!raw) return false;
  return Date.now() - Number(raw) > timeoutMs;
}

export function useSessionMonitor(options: {
  isAuthenticated: boolean;
  onExpired: () => void;
  timeoutMs?: number;
}) {
  const { isAuthenticated, onExpired, timeoutMs = DEFAULT_TIMEOUT_MS } = options;

  useEffect(() => {
    if (!isAuthenticated || typeof window === "undefined") return;

    touchSession();

    const check = () => {
      if (isSessionExpired(timeoutMs)) {
        notify.error(MESSAGES.ERROR.UNAUTHORIZED);
        onExpired();
      }
    };

    const onActivity = () => touchSession();
    const interval = window.setInterval(check, 60_000);

    window.addEventListener("click", onActivity);
    window.addEventListener("keydown", onActivity);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("click", onActivity);
      window.removeEventListener("keydown", onActivity);
    };
  }, [isAuthenticated, onExpired, timeoutMs]);
}
