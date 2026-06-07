import type { ReactNode } from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/**
 * Standard list container: a padded card with a search + filter toolbar
 * and the table rendered full-bleed inside.
 */
export function ListCard({
  search,
  onSearch,
  searchPlaceholder = "Search…",
  filters,
  onReset,
  children,
}: {
  search?: string;
  onSearch?: (value: string) => void;
  searchPlaceholder?: string;
  filters?: ReactNode;
  onReset?: () => void;
  children: ReactNode;
}) {
  const hasToolbar = onSearch !== undefined || filters !== undefined || onReset !== undefined;
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      {hasToolbar && (
        <div className="flex flex-wrap items-center gap-3 border-b p-4">
          {onSearch !== undefined && (
            <div className="relative flex-1 min-w-[220px]">
              <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search ?? ""}
                onChange={(e) => onSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="pl-9"
              />
            </div>
          )}
          {filters}
          {onReset && (
            <Button variant="outline" size="sm" onClick={onReset}>
              <Filter className="size-4 mr-1" /> Reset
            </Button>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
