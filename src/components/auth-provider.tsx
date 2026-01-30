"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type UserRole = "ADMIN" | "OPERATOR" | "CONTRACTOR";

export type AuthUser = {
  name: string;
  role: UserRole;
};

type AuthContextValue = {
  user: AuthUser | null;
  ready: boolean;
  login: (user: AuthUser) => void;
  register: (user: AuthUser) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "slm_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as AuthUser;
        if (parsed?.name && parsed?.role) setUser(parsed);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setReady(true);
  }, []);

  const saveUser = useCallback((nextUser: AuthUser) => {
    setUser(nextUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
  }, []);

  const login = useCallback((nextUser: AuthUser) => saveUser(nextUser), [saveUser]);
  const register = useCallback((nextUser: AuthUser) => saveUser(nextUser), [saveUser]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({ user, ready, login, register, logout }),
    [user, ready, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
