import type { ReactNode } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import type { StatusTone } from "../constants/status-tones";
import { cn } from "../lib/cn";

/** Vivid, solid icon chips so KPI cards read clearly at a glance. */
const ICON_TONE: Record<StatusTone, string> = {
  primary: "bg-primary text-primary-foreground",
  success: "bg-success text-success-foreground",
  info: "bg-info text-info-foreground",
  warning: "bg-warning text-warning-foreground",
  accent: "bg-[var(--color-chart-5)] text-white",
  destructive: "bg-destructive text-destructive-foreground",
  muted: "bg-muted text-muted-foreground",
};

export function StatCard({
  label,
  value,
  hint,
  tone = "primary",
  icon,
}: {
  label: string;
  value: string | number;
  hint?: string;
  tone?: StatusTone;
  icon?: ReactNode;
}) {
  const h = hint?.trim() ?? "";
  const trend = h.startsWith("+") ? "up" : h.startsWith("-") ? "down" : "flat";

  return (
    <div className="group rounded-xl border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight tabular-nums">{value}</div>
          {hint && (
            <div
              className={cn(
                "mt-1.5 inline-flex items-center gap-1 text-xs font-medium",
                trend === "up" && "text-success",
                trend === "down" && "text-destructive",
                trend === "flat" && "text-muted-foreground",
              )}
            >
              {trend === "up" && <TrendingUp className="size-3.5" />}
              {trend === "down" && <TrendingDown className="size-3.5" />}
              {hint}
            </div>
          )}
        </div>
        {icon && (
          <div
            className={cn(
              "grid size-11 shrink-0 place-items-center rounded-xl shadow-sm transition-transform duration-200 group-hover:scale-105",
              ICON_TONE[tone],
            )}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
