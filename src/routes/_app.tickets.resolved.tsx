import { createFileRoute } from "@tanstack/react-router";
import { TicketListPage } from "@/components/support/TicketListPage";

export const Route = createFileRoute("/_app/tickets/resolved")({
  head: () => ({ meta: [{ title: "Resolved · NavikX Support" }] }),
  component: () => (
    <TicketListPage
      title="Resolved Tickets"
      description="Tickets marked resolved or closed."
      filter={(t) => t.status === "Resolved" || t.status === "Closed"}
    />
  ),
});
