import { cn } from "@/lib/utils";
import type { TicketCategory } from "@/lib/mock/types";

const map: Record<TicketCategory, string> = {
  Payment: "bg-chart-2/15 text-chart-2 border-chart-2/30",
  Commission: "bg-chart-3/15 text-chart-3 border-chart-3/30",
  KYC: "bg-chart-4/15 text-chart-4 border-chart-4/30",
  Referral: "bg-chart-5/15 text-chart-5 border-chart-5/30",
  Technical: "bg-chart-1/15 text-chart-1 border-chart-1/30",
  General: "bg-muted text-muted-foreground border-border",
};

export function CategoryBadge({ category, className }: { category: TicketCategory; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        map[category],
        className
      )}
    >
      {category}
    </span>
  );
}
