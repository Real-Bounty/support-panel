import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { SupportRole } from "./support-credentials";

export interface SupportUser {
  id: string;
  name: string;
  email: string;
  username: string;
  role: SupportRole;
}

interface AuthCtx {
  user: SupportUser | null;
  login: (u: SupportUser) => void;
  logout: () => void;
}

const Ctx = createContext<AuthCtx>({ user: null, login: () => {}, logout: () => {} });
const KEY = "realbounty_support_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SupportUser | null>(null);
  useEffect(() => {
    setUser(getStoredUser());
  }, []);
  const login = (u: SupportUser) => {
    localStorage.setItem(KEY, JSON.stringify(u));
    setUser(u);
  };
  const logout = () => {
    localStorage.removeItem(KEY);
    setUser(null);
  };
  return <Ctx.Provider value={{ user, login, logout }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);

export function getStoredUser(): SupportUser | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as SupportUser) : null;
  } catch {
    return null;
  }
}
