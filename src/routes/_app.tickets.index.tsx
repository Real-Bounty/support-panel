import { createFileRoute } from "@tanstack/react-router";
import { TicketListPage } from "@/components/support/TicketListPage";

export const Route = createFileRoute("/_app/tickets/")({
  head: () => ({ meta: [{ title: "All Tickets · NavikX Support" }] }),
  component: () => <TicketListPage title="All Tickets" description="Every ticket across the platform." />,
});
