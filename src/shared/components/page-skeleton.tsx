import { cn } from "../lib/cn";

export function PageSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 w-48 rounded-md bg-muted" />
      <div className="h-4 w-72 rounded-md bg-muted" />
      <div className="rounded-xl border bg-card p-4 space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className={cn("h-10 rounded-md bg-muted", i % 2 === 0 ? "w-full" : "w-5/6")} />
        ))}
      </div>
    </div>
  );
}
