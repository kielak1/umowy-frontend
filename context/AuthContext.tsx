"use client";
import { createContext, useState, useContext, ReactNode } from "react";

// Typ kontekstu
type AuthContextType = {
  accessToken: string | null;
  username: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
};

// Domyślnie null, potem sprawdzamy w useAuth
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  async function login(username: string, password: string) {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) throw new Error("Błędny login lub hasło");
    const data = await res.json();
    setAccessToken(data.access);
    setUsername(data.username);
  }

  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    setAccessToken(null);
    setUsername(null);
  }

  async function refreshAccessToken() {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/token/refresh/`,
      {
        method: "POST",
        credentials: "include",
      }
    );
    if (!res.ok) return logout();
    const data = await res.json();
    setAccessToken(data.access);
  }

  return (
    <AuthContext.Provider
      value={{ accessToken, username, login, logout, refreshAccessToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
