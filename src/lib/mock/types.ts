export type TicketStatus =
  | "Open"
  | "In Progress"
  | "Waiting User"
  | "Escalated"
  | "Resolved"
  | "Closed";

export type TicketPriority = "Low" | "Medium" | "High" | "Critical";

export type TicketCategory =
  | "Payment"
  | "Commission"
  | "KYC"
  | "Referral"
  | "Technical"
  | "General";

export interface Agent {
  id: string;
  name: string;
  role: string;
  email: string;
}

export interface Message {
  id: string;
  author: "user" | "agent";
  agentId?: string;
  text: string;
  timestamp: string;
  internal?: boolean;
  attachment?: { name: string; url: string };
}

export interface EscalationEntry {
  id: string;
  by: string;
  at: string;
  level: "Level 2 Senior Support" | "Level 3 Admin";
  reason: string;
}

export interface RelatedLead {
  id: string;
  status: string;
  agent: string;
  interactions: string[];
  callRecordings: { id: string; label: string; duration: string }[];
}

export interface RelatedProperty {
  id: string;
  name: string;
  location: string;
}

export interface TicketUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  referralCount: number;
  purchaseCount: number;
  previousTicketCount: number;
}

export interface Ticket {
  id: string;
  subject: string;
  summary: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  assignedAgentId: string;
  createdAt: string;
  updatedAt: string;
  slaDueAt: string; // ISO; can be in the past = breached
  user: TicketUser;
  messages: Message[];
  unreadCount: number;
  escalation?: EscalationEntry[];
  relatedProperty?: RelatedProperty;
  relatedLead?: RelatedLead;
}
