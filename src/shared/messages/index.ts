export const MESSAGES = {
  SUCCESS: {
    DEFAULT: "Action completed successfully.",
    SAVED: "Changes saved successfully.",
    CREATED: "Created successfully.",
    UPDATED: "Updated successfully.",
    DELETED: "Deleted successfully.",
    SENT: "Sent successfully.",
    APPROVED: "Approved successfully.",
    REJECTED: "Rejected successfully.",
    EXPORTED: "Export started. Your file will download shortly.",
    LOGIN: "Welcome back.",
    PASSWORD_RESET: "Password updated. Sign in with your new password.",
    RESET_LINK: "If an account exists, reset instructions have been sent.",
    GENERATED: "Report generated successfully.",
    ACTIVATED: "Activated successfully.",
    DEACTIVATED: "Deactivated successfully.",
    BLOCKED: "Blocked successfully.",
    QUEUED: "Queued successfully.",
    ESCALATED: "Escalated successfully.",
    ASSIGNED: "Assigned successfully.",
    RESOLVED: "Marked as resolved.",
    CLOSED: "Closed successfully.",
    DEMO_RESET_LINK: "Password reset link generated (demo).",
    DISMISSED: "Dismissed successfully.",
  },
  ERROR: {
    DEFAULT: "Something went wrong. Please try again.",
    NETWORK: "Network error. Check your connection and try again.",
    UNAUTHORIZED: "Your session has expired. Please sign in again.",
    FORBIDDEN: "You do not have permission to perform this action.",
    NOT_FOUND: "The requested resource was not found.",
    VALIDATION: "Please fix the highlighted fields and try again.",
    INVALID_CREDENTIALS: "Invalid email/username or password.",
    INVALID_2FA: "Invalid verification code. Check your authenticator app and try again.",
    PASSWORD_MISMATCH: "Passwords do not match.",
    PASSWORD_TOO_SHORT: "Password must be at least 6 characters.",
    RESET_TOKEN_INVALID: "Invalid or expired reset link.",
    RESET_TOKEN_MISSING: "Missing reset token.",
    REQUIRED_FIELD: "This field is required.",
    REASON_REQUIRED: "Please provide a reason before continuing.",
  },
  INFO: {
    NO_CHANGES: "No changes to save.",
    PROCESSING: "Processing your request…",
    MARKED_REVIEW: "Marked for review.",
    STATUS_UPDATED: "Status updated.",
    EDIT_USER: "Edit user (mock).",
    KYC_RESET: "KYC reset requested.",
  },
  WARNING: {
    UNSAVED: "You have unsaved changes.",
  },
  EMPTY: {
    NO_DATA: "No data available yet.",
    NO_RESULTS: "No results match your filters.",
    NO_PERMISSION: "You do not have access to view this section.",
  },
} as const;

export type MessageKey = keyof typeof MESSAGES;

export function getHttpErrorMessage(status: number): string {
  if (status === 401) return MESSAGES.ERROR.UNAUTHORIZED;
  if (status === 403) return MESSAGES.ERROR.FORBIDDEN;
  if (status === 404) return MESSAGES.ERROR.NOT_FOUND;
  if (status === 422) return MESSAGES.ERROR.VALIDATION;
  if (status >= 500) return MESSAGES.ERROR.DEFAULT;
  return MESSAGES.ERROR.DEFAULT;
}
