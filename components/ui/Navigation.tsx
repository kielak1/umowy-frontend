"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { ChevronDown, LogOut, LogIn } from "lucide-react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

type PermissionEntry = {
  object: string;
  type: string;
};

const NAV_SECTIONS = [
  {
    label: "Umowy",
    visible: (perms: PermissionEntry[]) =>
      hasAccess(perms, "contracts", ["read", "write"]),
    items: [
      { href: "/contracts", label: "Przegląd" },
      { href: "/nowa-umowa", label: "Nowa umowa" },
    ],
  },
  {
    label: "Admin",
    visible: (perms: PermissionEntry[]) =>
      hasAccess(perms, "admin", ["system", "finance"]),
    items: [
      { href: "/admin/permissions", label: "Uprawnienia" },
      { href: "/admin/users", label: "Użytkownicy" },
      { href: "/register", label: "Nowy użytkownik" },
    ],
  },
];

function hasAccess(perms: PermissionEntry[], object: string, types: string[]) {
  return perms.some((p) => p.object === object && types.includes(p.type));
}

export default function Navigation() {
  const pathname = usePathname();
  const { username, login, logout } = useAuth();
  const [permissions, setPermissions] = useState<PermissionEntry[]>([]);
  const [formUsername, setFormUsername] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [error, setError] = useState("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!username) return;
    fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/permissions/user/me/`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        console.log("Uprawnienia użytkownika:", data);
        setPermissions(data);
      })
      .catch(() => setPermissions([]));
  }, [username]);

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

  const handleMouseEnter = (label: string) => {
    if (hideTimeout) clearTimeout(hideTimeout);
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => setOpenDropdown(null), 200);
    setHideTimeout(timeout);
  };

  return (
    <nav className="border-b px-4 py-2 bg-white shadow-sm">
      <ul className="flex items-center gap-6">
        <li>
          <Link
            href="/"
            className={`font-semibold ${pathname === "/" ? "underline" : ""}`}
          >
            Start
          </Link>
        </li>

        {username &&
          NAV_SECTIONS.filter((section) => section.visible(permissions)).map(
            (section) => (
              <li
                key={section.label}
                className="relative"
                onMouseEnter={() => handleMouseEnter(section.label)}
                onMouseLeave={handleMouseLeave}
              >
                <span className="inline-flex items-center cursor-pointer font-semibold hover:text-blue-700">
                  {section.label}
                  <ChevronDown className="ml-1 w-4 h-4" />
                </span>
                {openDropdown === section.label && (
                  <ul className="absolute z-10 bg-white border rounded shadow-md mt-1 min-w-[180px]">
                    {section.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={`block px-4 py-2 hover:bg-blue-50 ${
                            pathname === item.href ? "font-bold" : ""
                          }`}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )
          )}

        <li className="ml-auto">
          {username ? (
            <button
              onClick={logout}
              className="flex items-center text-red-600 hover:text-red-800"
            >
              <LogOut className="mr-1 w-4 h-4" />
              Wyloguj ({username})
            </button>
          ) : (
            <form onSubmit={handleLogin} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Login"
                value={formUsername}
                onChange={(e) => setFormUsername(e.target.value)}
                required
                className="border px-2 py-1 rounded"
              />
              <input
                type="password"
                placeholder="Hasło"
                value={formPassword}
                onChange={(e) => setFormPassword(e.target.value)}
                required
                className="border px-2 py-1 rounded"
              />
              <button
                type="submit"
                className="flex items-center bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                <LogIn className="mr-1 w-4 h-4" />
                Zaloguj
              </button>
              {error && <span className="text-red-600 text-sm">{error}</span>}
            </form>
          )}
        </li>
      </ul>
    </nav>
  );
}
