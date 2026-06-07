export type SupportRole = "Support Agent" | "Senior Support" | "Support Lead";

export interface SupportAccount {
  id: string;
  name: string;
  email: string;
  username: string;
  password: string;
  role: SupportRole;
}

export const SUPPORT_ACCOUNTS: SupportAccount[] = [
  {
    id: "sup-1",
    name: "Aarav Sharma",
    email: "aarav@realbounty.com",
    username: "aarav",
    password: "support123",
    role: "Support Lead",
  },
  {
    id: "sup-2",
    name: "Priya Verma",
    email: "priya@realbounty.com",
    username: "priya",
    password: "support123",
    role: "Senior Support",
  },
  {
    id: "sup-3",
    name: "Vikram Mehta",
    email: "vikram@realbounty.com",
    username: "vikram",
    password: "support123",
    role: "Support Agent",
  },
];

export const DEMO_SUPPORT_HINT =
  "Demo: aarav / priya / vikram — password: support123";

export function authenticateSupport(identifier: string, password: string): SupportAccount | null {
  const id = identifier.trim().toLowerCase();
  return (
    SUPPORT_ACCOUNTS.find(
      (a) =>
        (a.email.toLowerCase() === id || a.username.toLowerCase() === id) && a.password === password,
    ) ?? null
  );
}

export function findSupportAccount(identifier: string): SupportAccount | null {
  const id = identifier.trim().toLowerCase();
  return (
    SUPPORT_ACCOUNTS.find((a) => a.email.toLowerCase() === id || a.username.toLowerCase() === id) ??
    null
  );
}

const RESET_KEY = "realbounty_support_reset_tokens";

interface ResetToken {
  token: string;
  accountId: string;
  expiresAt: number;
}

function loadResetTokens(): ResetToken[] {
  try {
    const raw = localStorage.getItem(RESET_KEY);
    return raw ? (JSON.parse(raw) as ResetToken[]) : [];
  } catch {
    return [];
  }
}

function saveResetTokens(tokens: ResetToken[]) {
  localStorage.setItem(RESET_KEY, JSON.stringify(tokens));
}

export function createPasswordResetToken(identifier: string): string | null {
  const account = findSupportAccount(identifier);
  if (!account) return null;

  const token = `sup_rst_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
  const entry: ResetToken = { token, accountId: account.id, expiresAt: Date.now() + 60 * 60 * 1000 };
  const tokens = loadResetTokens().filter((t) => t.expiresAt > Date.now());
  tokens.push(entry);
  saveResetTokens(tokens);
  return token;
}

export function resetPasswordWithToken(
  token: string,
  newPassword: string,
): { ok: true } | { ok: false; error: string } {
  if (newPassword.length < 6) {
    return { ok: false, error: "Password must be at least 6 characters." };
  }

  const tokens = loadResetTokens();
  const entry = tokens.find((t) => t.token === token);
  if (!entry) return { ok: false, error: "Invalid or expired reset link." };
  if (entry.expiresAt < Date.now()) {
    saveResetTokens(tokens.filter((t) => t.token !== token));
    return { ok: false, error: "Reset link has expired. Request a new one." };
  }

  const account = SUPPORT_ACCOUNTS.find((a) => a.id === entry.accountId);
  if (!account) return { ok: false, error: "Account not found." };

  account.password = newPassword;
  saveResetTokens(tokens.filter((t) => t.token !== token));
  return { ok: true };
}
