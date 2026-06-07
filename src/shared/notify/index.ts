import { toast } from "sonner";
import { MESSAGES } from "../messages";

type NotifyOptions = {
  description?: string;
  duration?: number;
};

const DEFAULT_DURATION = 4000;

export const notify = {
  success(message: string, options?: NotifyOptions) {
    toast.success(message, {
      description: options?.description,
      duration: options?.duration ?? DEFAULT_DURATION,
    });
  },

  error(message: string, options?: NotifyOptions) {
    toast.error(message || MESSAGES.ERROR.DEFAULT, {
      description: options?.description,
      duration: options?.duration ?? 5000,
    });
  },

  warning(message: string, options?: NotifyOptions) {
    toast.warning(message, {
      description: options?.description,
      duration: options?.duration ?? DEFAULT_DURATION,
    });
  },

  info(message: string, options?: NotifyOptions) {
    toast.info(message, {
      description: options?.description,
      duration: options?.duration ?? DEFAULT_DURATION,
    });
  },

  loading(message: string) {
    return toast.loading(message);
  },

  dismiss(id?: string | number) {
    toast.dismiss(id);
  },

  promise<T>(
    promise: Promise<T>,
    messages: { loading: string; success: string; error?: string },
  ) {
    return toast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error ?? MESSAGES.ERROR.DEFAULT,
    });
  },
};
