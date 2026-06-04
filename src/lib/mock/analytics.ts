// Mock analytics data
const now = new Date();
const day = 24 * 60 * 60 * 1000;

export const responseTimeTrend = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(now.getTime() - (29 - i) * day);
  // synthetic but plausible numbers
  const base = 2.2 + Math.sin(i / 3) * 0.6 + (i % 7 === 0 ? 0.8 : 0);
  return {
    date: d.toISOString().slice(5, 10),
    responseHours: Number(base.toFixed(2)),
    resolutionHours: Number((base * 3.5 + (i % 5)).toFixed(2)),
  };
});

export const categoryDistribution = [
  { name: "Payment", value: 28 },
  { name: "Commission", value: 34 },
  { name: "KYC", value: 19 },
  { name: "Referral", value: 22 },
  { name: "Technical", value: 17 },
  { name: "General", value: 11 },
];

export const openVsResolvedDaily = Array.from({ length: 14 }, (_, i) => {
  const d = new Date(now.getTime() - (13 - i) * day);
  return {
    date: d.toISOString().slice(5, 10),
    opened: 8 + ((i * 3) % 7) + (i % 4),
    resolved: 6 + ((i * 2) % 6) + (i % 3),
  };
});

export interface AgentPerf {
  agentId: string;
  name: string;
  handled: number;
  avgResponseH: number;
  avgResolutionH: number;
  resolutionRate: number;
}

export const agentPerformance: AgentPerf[] = [
  { agentId: "a1", name: "Aarav Sharma", handled: 142, avgResponseH: 1.8, avgResolutionH: 7.4, resolutionRate: 0.92 },
  { agentId: "a2", name: "Priya Verma", handled: 128, avgResponseH: 2.1, avgResolutionH: 8.1, resolutionRate: 0.88 },
  { agentId: "a3", name: "Rohan Mehta", handled: 96, avgResponseH: 1.4, avgResolutionH: 6.2, resolutionRate: 0.95 },
  { agentId: "a4", name: "Neha Iyer", handled: 104, avgResponseH: 2.5, avgResolutionH: 9.0, resolutionRate: 0.86 },
  { agentId: "a5", name: "Vikram Kapoor", handled: 58, avgResponseH: 0.9, avgResolutionH: 5.3, resolutionRate: 0.97 },
  { agentId: "a6", name: "Sana Khan", handled: 119, avgResponseH: 2.3, avgResolutionH: 8.7, resolutionRate: 0.85 },
];
