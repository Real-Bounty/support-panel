import type { ReactNode } from "react";
import { cn } from "../lib/cn";

export function ContentCard({
  children,
  className,
  padding = true,
}: {
  children: ReactNode;
  className?: string;
  padding?: boolean;
}) {
  return (
    <div className={cn("rounded-xl border bg-card", padding && "p-4", className)}>{children}</div>
  );
}
