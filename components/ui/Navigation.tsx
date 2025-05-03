"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Start" },
  { href: "/contracts", label: "Umowy" },
  { href: "/nowa-umowa", label: "Nowa umowa" },
  { href: "/admin/permissions", label: "Uprawnienia" },
  { href: "/admin/users", label: "Użytkownicy" },
  { href: "/register", label: "Nowy użytkownik" },
];

export default function Navigation() {
  const pathname = usePathname();
  const { username, login, logout } = useAuth();

  const [formUsername, setFormUsername] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await login(formUsername, formPassword);
      setFormUsername("");
      setFormPassword("");
    } catch {
      setError("Błędny login lub hasło");
    }
  }

  return (
    <nav>
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          display: "flex",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        {navItems.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              style={{
                textDecoration: pathname === href ? "underline" : "none",
                fontWeight: pathname === href ? "bold" : "normal",
              }}
            >
              {label}
            </Link>
          </li>
        ))}

        <li>
          {username ? (
            <button onClick={logout}>Wyloguj ({username})</button>
          ) : (
            <form
              onSubmit={handleLogin}
              style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
            >
              <input
                type="text"
                placeholder="Login"
                value={formUsername}
                onChange={(e) => setFormUsername(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Hasło"
                value={formPassword}
                onChange={(e) => setFormPassword(e.target.value)}
                required
              />
              <button type="submit">Zaloguj</button>
              {error && <span style={{ color: "red" }}>{error}</span>}
            </form>
          )}
        </li>
      </ul>
    </nav>
  );
}
