"use client";

import { useState } from "react";
import {
  User,
  OrganizationalUnit,
  SecuredObjectType,
  PermissionType,
} from "./usePermissionsData";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

interface Props {
  users: User[];
  units: OrganizationalUnit[];
  objects: SecuredObjectType[];
  permissions: PermissionType[];
  onSuccess: () => void;
}

export default function PermissionForm({
  users,
  units,
  objects,
  permissions,
  onSuccess,
}: Props) {
  const [user, setUser] = useState<number | "">("");
  const [orgUnit, setOrgUnit] = useState<number | "">("");
  const [objectType, setObjectType] = useState<number | "">("");
  const [permission, setPermission] = useState<number | "">("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      user === "" ||
      orgUnit === "" ||
      objectType === "" ||
      permission === ""
    ) {
      alert("Uzupełnij wszystkie pola.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/api/permissions/user/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user,
            org_unit: orgUnit,
            object_type: objectType,
            permission,
          }),
        }
      );

      if (!res.ok) {
        const error = await res.json();
        alert("Błąd dodawania: " + JSON.stringify(error));
      } else {
        setUser("");
        setOrgUnit("");
        setObjectType("");
        setPermission("");
        onSuccess();
      }
    } catch (err) {
      alert("Błąd sieci: " + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 space-y-2">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <select
          value={user}
          onChange={(e) => setUser(Number(e.target.value))}
          className="border p-1"
          required
        >
          <option value="">Użytkownik</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.username}
            </option>
          ))}
        </select>

        <select
          value={orgUnit}
          onChange={(e) => setOrgUnit(Number(e.target.value))}
          className="border p-1"
          required
        >
          <option value="">Jednostka</option>
          {units.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>

        <select
          value={objectType}
          onChange={(e) => setObjectType(Number(e.target.value))}
          className="border p-1"
          required
        >
          <option value="">Obiekt</option>
          {objects.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>

        <select
          value={permission}
          onChange={(e) => setPermission(Number(e.target.value))}
          className="border p-1"
          required
        >
          <option value="">Uprawnienie</option>
          {permissions.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-1 px-4 rounded"
        disabled={loading}
      >
        {loading ? "Dodawanie..." : "Dodaj uprawnienie"}
      </button>
    </form>
  );
}
