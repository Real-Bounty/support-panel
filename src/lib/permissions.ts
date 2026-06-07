import type { SupportRole } from "./support-credentials";
import { PERM, type ModulePermission, type PermissionAction } from "@/shared";

export type SupportModule = "dashboard" | "tickets" | "analytics";

export const SUPPORT_MODULES = ["dashboard", "tickets", "analytics"] as const;

const P = PERM;

export const ROLE_NAV: Record<SupportRole, SupportModule[]> = {
  "Support Lead": [...SUPPORT_MODULES],
  "Senior Support": ["dashboard", "tickets", "analytics"],
  "Support Agent": ["dashboard", "tickets"],
};

export const ROLE_PERMISSIONS: Record<SupportRole, Record<SupportModule, ModulePermission>> = {
  "Support Lead": {
    dashboard: P.full,
    tickets: P.full,
    analytics: P.full,
  },
  "Senior Support": {
    dashboard: P.viewOnly,
    tickets: P.viewEdit,
    analytics: P.viewOnly,
  },
  "Support Agent": {
    dashboard: P.viewOnly,
    tickets: P.viewEdit,
    analytics: P.viewOnly,
  },
};

const PATH_TO_MODULE: Record<string, SupportModule> = {
  "/dashboard": "dashboard",
  "/tickets": "tickets",
  "/analytics": "analytics",
};

export function pathnameToModule(pathname: string): SupportModule | null {
  const base = pathname.split("?")[0];
  if (base.startsWith("/tickets")) return "tickets";
  return PATH_TO_MODULE[base] ?? null;
}

export function canAccess(role: SupportRole | undefined, module: SupportModule) {
  if (!role) return false;
  return ROLE_NAV[role].includes(module);
}

export function canPerform(
  role: SupportRole | undefined,
  module: SupportModule,
  action: PermissionAction,
): boolean {
  if (!role || !canAccess(role, module)) return false;
  const perm = ROLE_PERMISSIONS[role][module];
  if (action === "view") return perm.view;
  if (action === "edit") return perm.edit;
  return perm.delete;
}
