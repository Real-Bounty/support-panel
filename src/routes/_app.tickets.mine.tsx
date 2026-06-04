import { createFileRoute } from "@tanstack/react-router";
import { TicketListPage } from "@/components/support/TicketListPage";
import { currentAgentId } from "@/lib/mock/agents";

export const Route = createFileRoute("/_app/tickets/mine")({
  head: () => ({ meta: [{ title: "My Tickets · NavikX Support" }] }),
  component: () => (
    <TicketListPage
      title="My Tickets"
      description="Tickets assigned to you."
      filter={(t) => t.assignedAgentId === currentAgentId}
    />
  ),
});
