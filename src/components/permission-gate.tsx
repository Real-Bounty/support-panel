import type { ComponentProps, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import type { PermissionAction } from "@/shared";
import { canPerform, type SupportModule } from "@/lib/permissions";

export function PermissionGate({
  module,
  action,
  children,
  fallback = null,
}: {
  module: SupportModule;
  action: PermissionAction;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { user } = useAuth();
  if (!canPerform(user?.role, module, action)) return <>{fallback}</>;
  return <>{children}</>;
}

type PermissionButtonProps = ComponentProps<typeof Button> & {
  module: SupportModule;
  action: PermissionAction;
  hideWhenDenied?: boolean;
};

export function PermissionButton({
  module,
  action,
  hideWhenDenied = false,
  disabled,
  children,
  ...props
}: PermissionButtonProps) {
  const { user } = useAuth();
  const allowed = canPerform(user?.role, module, action);
  if (!allowed && hideWhenDenied) return null;
  return (
    <Button disabled={disabled || !allowed} {...props}>
      {children}
    </Button>
  );
}
