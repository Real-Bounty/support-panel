import { useEffect } from "react";
import { MESSAGES } from "../messages";

export function useUnsavedChanges(isDirty: boolean, message = MESSAGES.WARNING.UNSAVED) {
  useEffect(() => {
    if (!isDirty || typeof window === "undefined") return;

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = message;
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isDirty, message]);
}
