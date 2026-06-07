import type { ReactNode } from "react";
import { EmptyState } from "./empty-state";
import { ContentCard } from "./content-card";
import { MESSAGES } from "../messages";

export function DataTable({
  headers,
  children,
  isEmpty,
  emptyTitle = MESSAGES.EMPTY.NO_RESULTS,
  emptyDescription,
  footer,
}: {
  headers: ReactNode;
  children: ReactNode;
  isEmpty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  footer?: ReactNode;
}) {
  return (
    <ContentCard className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs text-muted-foreground">{headers}</thead>
          <tbody>
            {isEmpty ? (
              <tr>
                <td colSpan={99} className="p-0">
                  <EmptyState title={emptyTitle} description={emptyDescription} />
                </td>
              </tr>
            ) : (
              children
            )}
          </tbody>
        </table>
      </div>
      {footer}
    </ContentCard>
  );
}
