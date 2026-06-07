import type { ReactNode } from "react";
import { ConfirmProvider } from "./confirm-provider";

export function PanelProviders({ children }: { children: ReactNode }) {
  return <ConfirmProvider>{children}</ConfirmProvider>;
}
