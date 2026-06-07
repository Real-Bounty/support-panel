import type { Ticket, TicketCategory, TicketPriority, TicketStatus, Message } from "./types";

const HOUR = 60 * 60 * 1000;
const now = Date.now();
const iso = (offsetMs: number) => new Date(now + offsetMs).toISOString();

const userPool = [
  { id: "U10234", name: "Anjali Singh", phone: "+91 98201 12345", email: "anjali.s@gmail.com" },
  { id: "U10421", name: "Rakesh Patel", phone: "+91 98765 33221", email: "rakesh.p@gmail.com" },
  { id: "U10567", name: "Meera Joshi", phone: "+91 99001 44556", email: "meera.j@gmail.com" },
  { id: "U10678", name: "Karthik Rao", phone: "+91 90120 99887", email: "k.rao@gmail.com" },
  { id: "U10812", name: "Divya Nair", phone: "+91 98212 00112", email: "divya.n@gmail.com" },
  { id: "U10934", name: "Sahil Khanna", phone: "+91 97123 55667", email: "sahil.k@gmail.com" },
  { id: "U11045", name: "Ritu Bansal", phone: "+91 99887 66554", email: "ritu.b@gmail.com" },
  { id: "U11178", name: "Mohit Agarwal", phone: "+91 98330 22119", email: "mohit.a@gmail.com" },
  { id: "U11290", name: "Pooja Reddy", phone: "+91 98401 77888", email: "pooja.r@gmail.com" },
  { id: "U11345", name: "Tarun Bhatia", phone: "+91 99220 11334", email: "tarun.b@gmail.com" },
];

const sampleConversation = (userName: string): Message[] => [
  {
    id: "m1",
    author: "user",
    text: `Hi, I made a referral payment last week but I haven't received the commission credit yet. Please check on this. - ${userName}`,
    timestamp: iso(-26 * HOUR),
  },
  {
    id: "m2",
    author: "agent",
    agentId: "a1",
    text: "Hi! Thanks for reaching out. I'm looking into your account now and will pull the latest payment ledger.",
    timestamp: iso(-24 * HOUR),
  },
  {
    id: "m3",
    author: "agent",
    agentId: "a1",
    internal: true,
    text: "Checked ledger - payment captured but commission job failed at 04:12. Flagging to finance ops.",
    timestamp: iso(-23 * HOUR),
  },
  {
    id: "m4",
    author: "user",
    text: "Thank you, here is the screenshot of my payment receipt.",
    timestamp: iso(-20 * HOUR),
    attachment: { name: "receipt-2026-05-28.png", url: "#" },
  },
  {
    id: "m5",
    author: "agent",
    agentId: "a1",
    text: "Got it - confirmed on our end. Reprocessing the commission now. You should see it credited within 2 hours.",
    timestamp: iso(-2 * HOUR),
  },
  {
    id: "m6",
    author: "user",
    text: "Great, will wait. Thanks for the quick response!",
    timestamp: iso(-1 * HOUR),
  },
];

interface Seed {
  subject: string;
  summary: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  assignedAgentId: string;
  slaOffsetH: number; // hours from now (negative = breached)
  createdOffsetH: number;
  updatedOffsetH: number;
  userIdx: number;
  withProperty?: boolean;
  withLead?: boolean;
  escalated?: boolean;
  unread?: number;
}

const seeds: Seed[] = [
  { subject: "Commission not credited after payment", summary: "User paid but commission not visible in wallet for 5 days.", status: "In Progress", priority: "High", category: "Commission", assignedAgentId: "a1", slaOffsetH: 4, createdOffsetH: -26, updatedOffsetH: -1, userIdx: 0, withProperty: true, withLead: true, unread: 2 },
  { subject: "KYC verification failing repeatedly", summary: "Aadhaar OTP step throws error on submission.", status: "Open", priority: "Critical", category: "KYC", assignedAgentId: "a1", slaOffsetH: -3, createdOffsetH: -30, updatedOffsetH: -2, userIdx: 1, unread: 4 },
  { subject: "Referral link not tracking signups", summary: "User shared referral, signups not attributed.", status: "Waiting User", priority: "Medium", category: "Referral", assignedAgentId: "a1", slaOffsetH: 14, createdOffsetH: -48, updatedOffsetH: -6, userIdx: 2, withLead: true },
  { subject: "Cannot login on mobile app", summary: "Login screen crashes on Android 13.", status: "In Progress", priority: "High", category: "Technical", assignedAgentId: "a1", slaOffsetH: 2, createdOffsetH: -10, updatedOffsetH: -1, userIdx: 3, unread: 1 },
  { subject: "Wrong commission percentage applied", summary: "Tier 2 user charged Tier 1 rate.", status: "Escalated", priority: "High", category: "Commission", assignedAgentId: "a3", slaOffsetH: -8, createdOffsetH: -72, updatedOffsetH: -12, userIdx: 4, escalated: true, withProperty: true },
  { subject: "Payment refund request", summary: "User requesting refund for cancelled booking.", status: "Open", priority: "Medium", category: "Payment", assignedAgentId: "a2", slaOffsetH: 10, createdOffsetH: -8, updatedOffsetH: -2, userIdx: 5, withProperty: true, withLead: true },
  { subject: "Account email change request", summary: "User wants to update registered email.", status: "Resolved", priority: "Low", category: "General", assignedAgentId: "a1", slaOffsetH: 24, createdOffsetH: -120, updatedOffsetH: -48, userIdx: 6 },
  { subject: "Lead assignment dispute", summary: "Two agents claim same lead.", status: "Escalated", priority: "Critical", category: "Referral", assignedAgentId: "a4", slaOffsetH: -1, createdOffsetH: -54, updatedOffsetH: -3, userIdx: 7, escalated: true, withLead: true },
  { subject: "App freezes on property search", summary: "Search screen unresponsive after 5 results.", status: "In Progress", priority: "Medium", category: "Technical", assignedAgentId: "a2", slaOffsetH: 18, createdOffsetH: -20, updatedOffsetH: -4, userIdx: 8 },
  { subject: "GST invoice request", summary: "Need GST invoice for commission paid in May.", status: "Closed", priority: "Low", category: "General", assignedAgentId: "a6", slaOffsetH: 48, createdOffsetH: -240, updatedOffsetH: -120, userIdx: 9 },
  { subject: "KYC documents rejected without reason", summary: "PAN upload rejected 3 times, no explanation.", status: "Open", priority: "High", category: "KYC", assignedAgentId: "a1", slaOffsetH: 6, createdOffsetH: -12, updatedOffsetH: -1, userIdx: 0, unread: 3 },
  { subject: "Duplicate payment charged", summary: "Card charged twice for same property booking.", status: "Escalated", priority: "Critical", category: "Payment", assignedAgentId: "a5", slaOffsetH: -5, createdOffsetH: -36, updatedOffsetH: -6, userIdx: 1, escalated: true, withProperty: true, withLead: true },
  { subject: "Referral bonus calculation query", summary: "User questioning referral bonus math.", status: "Waiting User", priority: "Low", category: "Referral", assignedAgentId: "a2", slaOffsetH: 30, createdOffsetH: -60, updatedOffsetH: -10, userIdx: 2 },
  { subject: "Wallet balance mismatch", summary: "Wallet shows ₹2,400 less than expected.", status: "In Progress", priority: "High", category: "Commission", assignedAgentId: "a3", slaOffsetH: 3, createdOffsetH: -18, updatedOffsetH: -2, userIdx: 3 },
  { subject: "Cannot upload property photos", summary: "Image upload fails with 500 error.", status: "Open", priority: "Medium", category: "Technical", assignedAgentId: "a6", slaOffsetH: 12, createdOffsetH: -6, updatedOffsetH: -1, userIdx: 4, withProperty: true },
  { subject: "Lead call recording missing", summary: "User reports no recording for important call.", status: "Resolved", priority: "Medium", category: "Referral", assignedAgentId: "a1", slaOffsetH: 36, createdOffsetH: -96, updatedOffsetH: -24, userIdx: 5, withLead: true },
  { subject: "Onboarding tutorial stuck", summary: "Tutorial step 3 won't advance.", status: "Closed", priority: "Low", category: "Technical", assignedAgentId: "a2", slaOffsetH: 72, createdOffsetH: -300, updatedOffsetH: -200, userIdx: 6 },
  { subject: "Bank account verification pending", summary: "Penny drop not received for 4 days.", status: "Open", priority: "High", category: "KYC", assignedAgentId: "a1", slaOffsetH: 1, createdOffsetH: -16, updatedOffsetH: -1, userIdx: 7, unread: 1 },
  { subject: "Property listing not showing", summary: "Approved listing not appearing in search.", status: "In Progress", priority: "Medium", category: "Technical", assignedAgentId: "a4", slaOffsetH: 20, createdOffsetH: -28, updatedOffsetH: -5, userIdx: 8, withProperty: true },
  { subject: "Withdrawal request stuck", summary: "Withdrawal pending for 3 business days.", status: "Escalated", priority: "High", category: "Payment", assignedAgentId: "a3", slaOffsetH: -12, createdOffsetH: -84, updatedOffsetH: -10, userIdx: 9, escalated: true },
  { subject: "Need help with referral program", summary: "How does the multi-tier referral work?", status: "Resolved", priority: "Low", category: "General", assignedAgentId: "a6", slaOffsetH: 48, createdOffsetH: -150, updatedOffsetH: -50, userIdx: 0 },
  { subject: "Commission slab change query", summary: "Slab changed mid-month, user unhappy.", status: "Open", priority: "Medium", category: "Commission", assignedAgentId: "a2", slaOffsetH: 8, createdOffsetH: -14, updatedOffsetH: -2, userIdx: 1 },
];

const mkUser = (idx: number) => {
  const u = userPool[idx % userPool.length];
  return {
    ...u,
    referralCount: 8 + (idx * 3) % 25,
    purchaseCount: 1 + (idx * 2) % 6,
    previousTicketCount: (idx % 5) + 1,
  };
};

const tickets: Ticket[] = seeds.map((s, i) => {
  const id = `TKT-${(10240 + i).toString()}`;
  const u = mkUser(s.userIdx);
  const msgs = sampleConversation(u.name);
  return {
    id,
    subject: s.subject,
    summary: s.summary,
    status: s.status,
    priority: s.priority,
    category: s.category,
    assignedAgentId: s.assignedAgentId,
    createdAt: iso(s.createdOffsetH * HOUR),
    updatedAt: iso(s.updatedOffsetH * HOUR),
    slaDueAt: iso(s.slaOffsetH * HOUR),
    user: u,
    messages: msgs,
    unreadCount: s.unread ?? 0,
    escalation: s.escalated
      ? [
          {
            id: "e1",
            by: "Aarav Sharma",
            at: iso(s.updatedOffsetH * HOUR - 4 * HOUR),
            level: s.priority === "Critical" ? "Level 3 Admin" : "Level 2 Senior Support",
            reason:
              "Issue requires senior intervention - financial impact on user and unable to resolve at L1.",
          },
        ]
      : undefined,
    relatedProperty: s.withProperty
      ? { id: `P-${1200 + i}`, name: "Prestige Lakeside Habitat", location: "Whitefield, Bengaluru" }
      : undefined,
    relatedLead: s.withLead
      ? {
          id: `L-${4400 + i}`,
          status: "Site Visit Scheduled",
          agent: "Rohan Mehta",
          interactions: [
            "Initial call · 12 min · interested in 3BHK",
            "Follow-up WhatsApp · sent brochure",
            "Site visit confirmed for Saturday 11:00 AM",
          ],
          callRecordings: [
            { id: "r1", label: "Intro call · 28 May", duration: "12:04" },
            { id: "r2", label: "Follow-up · 30 May", duration: "07:21" },
          ],
        }
      : undefined,
  };
});

// --- mutable in-memory store with pub/sub ---
let store: Ticket[] = tickets;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const ticketsStore = {
  getAll: () => store,
  get: (id: string) => store.find((t) => t.id === id),
  update: (id: string, patch: Partial<Ticket>) => {
    store = store.map((t) =>
      t.id === id ? { ...t, ...patch, updatedAt: new Date().toISOString() } : t
    );
    emit();
  },
  addMessage: (id: string, msg: Message) => {
    store = store.map((t) =>
      t.id === id
        ? { ...t, messages: [...t.messages, msg], updatedAt: new Date().toISOString() }
        : t
    );
    emit();
  },
  addEscalation: (id: string, entry: EscalationEntryInput) => {
    store = store.map((t) =>
      t.id === id
        ? {
            ...t,
            status: "Escalated",
            escalation: [
              ...(t.escalation ?? []),
              { id: `e${(t.escalation?.length ?? 0) + 1}`, at: new Date().toISOString(), ...entry },
            ],
            updatedAt: new Date().toISOString(),
          }
        : t
    );
    emit();
  },
  subscribe: (fn: () => void) => {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};

type EscalationEntryInput = {
  by: string;
  level: "Level 2 Senior Support" | "Level 3 Admin";
  reason: string;
};
