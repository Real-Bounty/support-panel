import { useEffect, useState } from "react";
import { ticketsStore } from "@/lib/mock/tickets";
import type { Ticket } from "@/lib/mock/types";

export function useTickets(): Ticket[] {
  const [, force] = useState(0);
  useEffect(() => ticketsStore.subscribe(() => force((x) => x + 1)), []);
  return ticketsStore.getAll();
}

export function useTicket(id: string): Ticket | undefined {
  const [, force] = useState(0);
  useEffect(() => ticketsStore.subscribe(() => force((x) => x + 1)), []);
  return ticketsStore.get(id);
}

export function useNow(intervalMs = 60_000): number {
  const [t, setT] = useState(() => Date.now());
  useEffect(() => {
    const i = setInterval(() => setT(Date.now()), intervalMs);
    return () => clearInterval(i);
  }, [intervalMs]);
  return t;
}
