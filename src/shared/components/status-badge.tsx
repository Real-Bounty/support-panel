import { resolveStatusTone, STATUS_TONE_CLASSES, type StatusTone } from "../constants/status-tones";
import { cn } from "../lib/cn";

export function StatusBadge({
  value,
  map,
  classNameMap,
  className,
  rounded = "md",
}: {
  value: string;
  map?: Record<string, StatusTone>;
  classNameMap?: Record<string, string>;
  className?: string;
  rounded?: "md" | "full";
}) {
  const customClass = classNameMap?.[value];
  const tone = resolveStatusTone(value, map);

  return (
    <span
      className={cn(
        "inline-flex items-center border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        rounded === "full" ? "rounded-full" : "rounded-md",
        customClass ?? STATUS_TONE_CLASSES[tone],
        className,
      )}
    >
      {value}
    </span>
  );
}
