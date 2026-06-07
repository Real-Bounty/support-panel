import {
  createContext,
  useContext,
  useMemo,
  type ComponentProps,
  type ReactNode,
} from "react";
import type { PermissionAction } from "./types";

export type CanPerformFn<M extends string> = (module: M, action: PermissionAction) => boolean;

interface PermissionContextValue<M extends string> {
  canPerform: CanPerformFn<M>;
}

function createPermissionContext<M extends string>() {
  return createContext<PermissionContextValue<M> | null>(null);
}

export function createPermissionSystem<M extends string>() {
  const Ctx = createPermissionContext<M>();

  function PermissionProvider({
    canPerform,
    children,
  }: {
    canPerform: CanPerformFn<M>;
    children: ReactNode;
  }) {
    const value = useMemo(() => ({ canPerform }), [canPerform]);
    return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
  }

  function usePermissions() {
    const ctx = useContext(Ctx);
    if (!ctx) throw new Error("usePermissions must be used within PermissionProvider");
    return ctx;
  }

  function useModulePermission(module: M) {
    const { canPerform } = usePermissions();
    return {
      canView: canPerform(module, "view"),
      canEdit: canPerform(module, "edit"),
      canDelete: canPerform(module, "delete"),
    };
  }

  function PermissionGate({
    module,
    action,
    children,
    fallback = null,
  }: {
    module: M;
    action: PermissionAction;
    children: ReactNode;
    fallback?: ReactNode;
  }) {
    const { canPerform } = usePermissions();
    if (!canPerform(module, action)) return <>{fallback}</>;
    return <>{children}</>;
  }

  type GateButtonProps = ComponentProps<"button"> & {
    module: M;
    action: PermissionAction;
    hideWhenDenied?: boolean;
    className?: string;
  };

  function PermissionButton({
    module,
    action,
    hideWhenDenied = false,
    disabled,
    children,
    className = "",
    ...props
  }: GateButtonProps) {
    const { canPerform } = usePermissions();
    const allowed = canPerform(module, action);
    if (!allowed && hideWhenDenied) return null;

    const base =
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90";

    return (
      <button
        type="button"
        disabled={disabled || !allowed}
        className={[base, className].filter(Boolean).join(" ")}
        {...props}
      >
        {children}
      </button>
    );
  }

  return {
    PermissionProvider,
    usePermissions,
    useModulePermission,
    PermissionGate,
    PermissionButton,
  };
}
