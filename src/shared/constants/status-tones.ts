export type StatusTone =
  | "success"
  | "warning"
  | "destructive"
  | "info"
  | "muted"
  | "primary"
  | "accent";

export const STATUS_TONE_CLASSES: Record<StatusTone, string> = {
  success: "bg-success/15 text-success border-success/30",
  warning: "bg-warning/20 text-warning-foreground border-warning/40",
  destructive: "bg-destructive/15 text-destructive border-destructive/30",
  info: "bg-info/15 text-info border-info/30",
  muted: "bg-muted text-muted-foreground border-border",
  primary: "bg-primary/10 text-primary border-primary/30",
  accent: "bg-accent/20 text-accent-foreground border-accent/40",
};

const SUCCESS_VALUES = new Set([
  "Active",
  "Approved",
  "Paid",
  "Verified",
  "Confirmed",
  "Completed",
  "Resolved",
  "Closed",
  "Online",
  "Converted",
  "Delivered",
  "Closed Won",
]);

const WARNING_VALUES = new Set([
  "Pending",
  "On-Hold",
  "In Progress",
  "New",
  "Partial",
  "Contacted",
  "Site Visit",
  "Negotiation",
  "Open",
  "Waiting User",
  "Follow-up",
  "Medium",
]);

const DESTRUCTIVE_VALUES = new Set([
  "Inactive",
  "Blocked",
  "Rejected",
  "Cancelled",
  "Lost",
  "Urgent",
  "High",
  "Escalated",
  "Closed Lost",
]);

export function resolveStatusTone(value: string, map?: Record<string, StatusTone>): StatusTone {
  if (map?.[value]) return map[value];
  if (SUCCESS_VALUES.has(value)) return "success";
  if (WARNING_VALUES.has(value)) return "warning";
  if (DESTRUCTIVE_VALUES.has(value)) return "destructive";
  if (value === "Low" || value === "Offline") return "muted";
  if (value === "Starter") return "info";
  if (value === "Growth") return "primary";
  if (value === "Elite") return "accent";
  return "muted";
}
