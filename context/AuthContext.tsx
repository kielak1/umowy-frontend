"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

type AuthContextType = {
  username: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter(); // <- legalne użycie hooka

  async function login(username: string, password: string) {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) throw new Error("Błędny login lub hasło");

    const data = await res.json();
    sessionStorage.setItem("access_token", data.access);
    setUsername(data.username);
  }

  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    sessionStorage.removeItem("access_token");
    setUsername(null);
    router.push("/"); 
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
    sessionStorage.setItem("access_token", data.access);
  }

  return (
    <AuthContext.Provider
      value={{ username, login, logout, refreshAccessToken }}
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
