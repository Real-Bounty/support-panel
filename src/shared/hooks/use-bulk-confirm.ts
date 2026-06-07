import { useCallback } from "react";
import { useConfirm } from "../providers/confirm-provider";

export function useBulkConfirm() {
  const { confirm } = useConfirm();

  return useCallback(
    (options: {
      count: number;
      noun: string;
      description?: string;
      confirmLabel?: string;
      onConfirm: () => void | Promise<void>;
    }) => {
      const { count, noun, description, confirmLabel = "Confirm", onConfirm } = options;
      confirm({
        title: `${confirmLabel} ${count} ${noun}${count === 1 ? "" : "s"}?`,
        description: description ?? `This will affect ${count} selected ${noun}${count === 1 ? "" : "s"}.`,
        confirmLabel,
        variant: "destructive",
        onConfirm,
      });
    },
    [confirm],
  );
}
