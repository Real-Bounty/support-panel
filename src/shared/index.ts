export { cn } from "./lib/cn";

export { MESSAGES, getHttpErrorMessage } from "./messages";

export type { ApiResult, ApiSuccess, ApiFailure, ApiFieldErrors, ApiClientError } from "./api/types";
export { normalizeError, failureFromStatus } from "./api/normalize-error";
export { handleApiResponse, runApiAction, mockSuccess, mockFailure } from "./api/handle-response";
export { createApiClient, type ApiClient, type ApiClientOptions, type RequestOptions } from "./api/client";

export { formatInr, formatPhone, formatDate, formatRelativeTime, formatPercent } from "./format";

export { notify } from "./notify";

export { useDebounce } from "./hooks/use-debounce";
export { useAppQuery, useAppMutation } from "./hooks/use-app-query";
export { useUnsavedChanges } from "./hooks/use-unsaved-changes";
export { useBulkConfirm } from "./hooks/use-bulk-confirm";
export { useSessionMonitor, touchSession, isSessionExpired } from "./hooks/use-session-monitor";

export type { PermissionAction, ModulePermission } from "./permissions/types";
export { PERM } from "./permissions/types";
export { createPermissionSystem } from "./permissions/permission-provider";
export { ConfirmProvider, useConfirm, type ConfirmOptions, type ConfirmVariant } from "./providers/confirm-provider";
export { PanelProviders } from "./providers/panel-providers";

export { PageHeader } from "./components/page-header";
export { StatCard } from "./components/stat-card";
export { StatusBadge } from "./components/status-badge";
export { EmptyState } from "./components/empty-state";
export { ContentCard } from "./components/content-card";
export { SectionBlock } from "./components/section-block";
export { PageSkeleton } from "./components/page-skeleton";
export { DataTable } from "./components/data-table";
export { FilterBar } from "./components/filter-bar";
export { FormDialog } from "./components/form-dialog";
export { PromptDialog } from "./components/prompt-dialog";
export { SessionMonitor } from "./components/session-monitor";

export {
  resolveStatusTone,
  STATUS_TONE_CLASSES,
  type StatusTone,
} from "./constants/status-tones";
