import { createFileRoute } from "@tanstack/react-router";
import { TicketListPage } from "@/components/support/TicketListPage";

export const Route = createFileRoute("/_app/tickets/escalated")({
  head: () => ({ meta: [{ title: "Escalated · NavikX Support" }] }),
  component: () => (
    <TicketListPage
      title="Escalated Tickets"
      description="Tickets escalated to senior support or admin."
      filter={(t) => t.status === "Escalated"}
    />
  ),
});
