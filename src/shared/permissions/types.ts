export type PermissionAction = "view" | "edit" | "delete";

export interface ModulePermission {
  view: boolean;
  edit: boolean;
  delete: boolean;
}

export const PERM = {
  full: { view: true, edit: true, delete: true } satisfies ModulePermission,
  viewEdit: { view: true, edit: true, delete: false } satisfies ModulePermission,
  viewOnly: { view: true, edit: false, delete: false } satisfies ModulePermission,
} as const;
