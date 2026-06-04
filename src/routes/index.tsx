import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const authed = localStorage.getItem("navikx-auth") === "1";
      throw redirect({ to: authed ? "/dashboard" : "/login" });
    }
    throw redirect({ to: "/login" });
  },
  component: () => null,
});
