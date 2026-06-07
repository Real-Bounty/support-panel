import { useEffect, useState, type ReactNode } from "react";
import { cn } from "../lib/cn";

export function FormDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  if (!mounted || !open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        className="fixed inset-0 bg-black/80"
        onClick={() => onOpenChange(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="form-dialog-title"
        aria-describedby={description ? "form-dialog-desc" : undefined}
        className={cn(
          "relative z-10 grid w-full max-w-lg gap-4",
          "border bg-background p-6 shadow-lg sm:rounded-lg",
        )}
      >
        <div className="space-y-1.5">
          <h2 id="form-dialog-title" className="text-lg font-semibold">
            {title}
          </h2>
          {description && (
            <p id="form-dialog-desc" className="text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {children}
        {footer && <div className="flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}
