import type { Agent } from "./types";

export const agents: Agent[] = [
  { id: "a1", name: "Aarav Sharma", role: "Support Agent · L1", email: "aarav@realbounty.com" },
  { id: "a2", name: "Priya Verma", role: "Support Agent · L1", email: "priya@realbounty.com" },
  { id: "a3", name: "Rohan Mehta", role: "Senior Support · L2", email: "rohan@realbounty.com" },
  { id: "a4", name: "Neha Iyer", role: "Senior Support · L2", email: "neha@realbounty.com" },
  { id: "a5", name: "Vikram Kapoor", role: "Admin · L3", email: "vikram@realbounty.com" },
  { id: "a6", name: "Sana Khan", role: "Support Agent · L1", email: "sana@realbounty.com" },
];

export const currentAgentId = "a1";
export const currentAgent = agents[0];

export const agentById = (id: string) => agents.find((a) => a.id === id);
