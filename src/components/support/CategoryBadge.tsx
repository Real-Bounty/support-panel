import { cn } from "@/lib/utils";
import type { TicketCategory } from "@/lib/mock/types";

const DEFAULT_CLASSES: Record<TicketCategory, string> = {
  Payment: "bg-chart-2/15 text-chart-2 border-chart-2/30",
  Commission: "bg-chart-3/15 text-chart-3 border-chart-3/30",
  KYC: "bg-chart-4/15 text-chart-4 border-chart-4/30",
  Referral: "bg-chart-5/15 text-chart-5 border-chart-5/30",
  Technical: "bg-chart-1/15 text-chart-1 border-chart-1/30",
  General: "bg-muted text-muted-foreground border-border",
};

const CHIP_CLASSES: Record<TicketCategory, string> = {
  Payment: "chip-category-payment",
  Commission: "chip-category-commission",
  KYC: "chip-category-kyc",
  Referral: "chip-category-referral",
  Technical: "chip-category-technical",
  General: "chip-category-general",
};

const CHIP_BASE = "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap";
const DEFAULT_BASE = "inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium whitespace-nowrap";

export function CategoryBadge({
  category,
  className,
  variant = "default",
}: {
  category: TicketCategory;
  className?: string;
  variant?: "default" | "chip";
}) {
  const isChip = variant === "chip";

  return (
    <span
      className={cn(
        isChip ? CHIP_BASE : DEFAULT_BASE,
        isChip ? CHIP_CLASSES[category] : DEFAULT_CLASSES[category],
        className,
      )}
    >
      {category}
    </span>
  );
}
