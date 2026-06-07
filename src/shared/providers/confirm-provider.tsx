import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { cn } from "../lib/cn";

export type ConfirmVariant = "default" | "destructive";

export interface ConfirmOptions {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
  onConfirm: () => void | Promise<void>;
}

interface ConfirmState extends ConfirmOptions {
  open: boolean;
  loading: boolean;
}

interface ConfirmContextValue {
  confirm: (options: ConfirmOptions) => void;
}

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

const buttonBase =
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2";

function ConfirmDialog({
  state,
  onClose,
  onConfirm,
}: {
  state: ConfirmState;
  onClose: () => void;
  onConfirm: () => void;
}) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !state.loading) onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose, state.loading]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        className="fixed inset-0 bg-black/80"
        onClick={() => !state.loading && onClose()}
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby={state.description ? "confirm-desc" : undefined}
        className="relative z-10 grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg sm:rounded-lg"
      >
        <div className="space-y-2">
          <h2 id="confirm-title" className="text-lg font-semibold">
            {state.title}
          </h2>
          {state.description && (
            <p id="confirm-desc" className="text-sm text-muted-foreground">
              {state.description}
            </p>
          )}
        </div>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={state.loading}
            onClick={onClose}
            className={cn(buttonBase, "border border-input bg-background hover:bg-accent hover:text-accent-foreground")}
          >
            {state.cancelLabel ?? "Cancel"}
          </button>
          <button
            type="button"
            disabled={state.loading}
            onClick={onConfirm}
            className={cn(
              buttonBase,
              state.variant === "destructive"
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : "bg-primary text-primary-foreground hover:bg-primary/90",
            )}
          >
            {state.loading ? "Please wait…" : (state.confirmLabel ?? "Confirm")}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<ConfirmState | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const confirm = useCallback((options: ConfirmOptions) => {
    setState({ ...options, open: true, loading: false });
  }, []);

  const close = useCallback(() => {
    setState((prev) => {
      if (prev?.loading) return prev;
      return null;
    });
  }, []);

  const onConfirm = useCallback(async () => {
    if (!state) return;
    setState((prev) => (prev ? { ...prev, loading: true } : prev));
    try {
      await state.onConfirm();
      setState(null);
    } catch {
      setState((prev) => (prev ? { ...prev, loading: false } : prev));
    }
  }, [state]);

  const value = useMemo(() => ({ confirm }), [confirm]);

  return (
    <ConfirmContext.Provider value={value}>
      {children}
      {mounted && state && (
        <ConfirmDialog state={state} onClose={close} onConfirm={() => { void onConfirm(); }} />
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    throw new Error("useConfirm must be used within ConfirmProvider");
  }
  return ctx;
}
