
# NavikX Support Panel — Build Plan

A frontend-only (mock data) support console for handling user tickets, with sidebar navigation and 5 main screens. No backend; all data lives in a typed mock module.

## Design system

- Light theme. Primary `#8C2020` (deep support red), with a slightly lighter hover tone. Neutral grays for surfaces, subtle borders.
- Font: Inter (loaded via Google Fonts in `__root.tsx` head).
- Tokens defined in `src/styles.css` under `:root` + `@theme inline` (oklch):
  - `--primary` (≈ #8C2020), `--primary-foreground` (white)
  - Status colors: `--status-open`, `--status-progress`, `--status-waiting`, `--status-escalated`, `--status-resolved`, `--status-closed`
  - Priority: `--priority-critical` (red), `--priority-high` (orange), `--priority-medium` (amber), `--priority-low` (gray)
  - SLA: `--sla-green`, `--sla-amber`, `--sla-red`
- shadcn components used: button, input, textarea, card, badge, table, select, dropdown-menu, dialog, tabs, sidebar, popover, calendar, separator, avatar, scroll-area, sonner (toast), chart.

## Routing (TanStack Start, file-based)

```
src/routes/
  __root.tsx          (Inter font, head, QueryClient)
  index.tsx           (redirect → /login or /dashboard based on mock auth)
  login.tsx           (no layout)
  _app.tsx            (sidebar layout, <Outlet />)
  _app.dashboard.tsx
  _app.tickets.tsx           (All Tickets)
  _app.tickets.mine.tsx      (My Tickets)
  _app.tickets.escalated.tsx
  _app.tickets.resolved.tsx
  _app.tickets.$ticketId.tsx (Ticket Detail)
  _app.analytics.tsx
```

Mock auth = boolean in `localStorage`; login screen sets it and navigates to `/dashboard`. `_app` layout redirects to `/login` if not set.

## Shared building blocks (`src/components/support/`)

- `AppSidebar.tsx` — shadcn sidebar with NavikX wordmark, 6 nav items (Dashboard, All Tickets, My Tickets, Escalated, Resolved, Analytics), active-route highlighting, agent profile footer.
- `StatusBadge.tsx`, `PriorityBadge.tsx`, `CategoryBadge.tsx` — token-driven colored badges.
- `SlaIndicator.tsx` — pill with clock icon; green if >50% time left, amber if <50%, red if breached (shows "Overdue 2h 15m"). Visually prominent (bold, colored bg).
- `TicketTable.tsx` — reusable table that accepts a filtered ticket list; columns per spec; row click → `/tickets/$ticketId`.
- `TicketFilters.tsx` — status/priority/category multi-selects, date range popover, search input. Controlled state lifted into each list route.
- `ChatThread.tsx`, `MessageBubble.tsx`, `ChatComposer.tsx`, `EscalationDialog.tsx`.

## Mock data (`src/lib/mock/`)

- `agents.ts` — 6 agents (current user = "Aarav Sharma", L1 Support).
- `tickets.ts` — 22 tickets across categories/statuses/priorities, varied SLA states (some breached). Each ticket has user details, optional related property, optional related lead with call recordings, escalation history when applicable, and a 5–6 message conversation including 1 internal note and 1 attachment thumbnail.
- `analytics.ts` — 30-day response-time series, category distribution, agent perf rows, daily open-vs-resolved series.
- All data typed; selectors like `getMyTickets()`, `getEscalated()`, `getResolved()`, `getTicketById()`.

State updates (status changes, sends, escalations) mutate an in-memory store wrapped in a tiny pub/sub hook (`useTickets()`), so UI updates feel real within a session.

## Screens

### 1. Login (`/login`)
Centered card on subtle background. NavikX logo/wordmark in primary red. Email + password inputs, "Support Agent" role chip, Sign In button (validates non-empty → sets mock auth → navigates). Footer line: "NavikX Internal Support Console".

### 2. Dashboard (`/dashboard`)
- SLA breach banner at top (red) if any ticket breached — count + "View breached" link to All Tickets filtered.
- 6 stat cards in responsive grid: Open Tickets, My Assigned, Escalated, Avg Response Time (h), Avg Resolution Time (h), Resolved Today. Each card shows value + small delta vs yesterday + icon.
- Unread messages badge on header bell icon (in topbar above content).
- "My recent tickets" card: 5 most recent assigned to current agent, with inline status `Select` for quick update.

### 3. Ticket Lists
Four routes share `<TicketListPage>` with a preset filter:
- All Tickets — no preset
- My Tickets — assignee = current agent
- Escalated — status = Escalated (escalation level shown)
- Resolved — status in {Resolved, Closed}

Layout: filter bar on top, table below. Filters: Status, Priority, Category multiselects; Date range; search by User/Ticket ID. Pagination footer (client-side). SLA indicator column uses `SlaIndicator`. Actions menu per row: View, Assign to me, Change status.

### 4. Ticket Detail (`/tickets/$ticketId`)
Two-column grid (lg: 7/5 split, stacks on mobile).

Left:
- Header bar: Ticket ID + Category badge + Priority badge + Status `Select` + Assigned agent `Select`.
- User Details card: name, phone, referral count, purchase count, "Previous tickets (4)" link → filtered list.
- Related Property card (conditional): name, location, thumbnail.
- Related Lead card (conditional): status, agent, last 3 interactions, call recordings list with play icon (mock URLs, no real audio).
- Escalation History card (conditional): timeline of escalations (who, when, level, reason).

Right:
- ChatThread: scroll area with alternating bubbles — user (left, gray), agent (right, primary tint). Internal notes inline with amber background + "Internal Note" label. Attachment messages render thumbnails.
- ChatComposer: textarea, attachment icon, Reply/Internal toggle (switch), character count, Send.
- Action row below: Change Status, Assign to Agent, Escalate, Mark Resolved, Mark Closed.
- EscalationDialog: Level (L2 Senior Support / L3 Admin) select, Reason textarea, Confirm. On confirm: updates status to Escalated, appends to escalation history, toast.

### 5. Analytics (`/analytics`)
Date range filter (default last 30 days).
- Response Time Trend — `LineChart` (recharts via shadcn chart).
- Category Distribution — `PieChart`.
- Open vs Resolved by Day — grouped `BarChart`.
- Agent Performance table: Agent, Tickets handled, Avg response (h), Avg resolution (h), Resolution rate (%).

## Technical notes

- All colors via tokens — no raw hex in components.
- Inter loaded via `<link>` tags in `__root.tsx` `head().links`; set `font-family` on body in `styles.css`.
- TanStack Router `<Link>` with `activeProps` for sidebar highlighting.
- SLA timer uses a `useNow()` hook (1-min interval) so indicators update live.
- No real backend, no Lovable Cloud, no auth provider — explicitly mock to keep scope to the support-panel UI as requested.

## Out of scope (call out)

- No real authentication, no persistence across reloads (mock store resets).
- No real file uploads or audio playback — attachments and call recordings are visual placeholders.
- No email/notification sending.

