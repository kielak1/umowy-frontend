"use client";

import { useEffect, useState, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
// import 'ag-grid-community/styles/ag-grid.css';
import "ag-grid-community/styles/ag-theme-quartz.css";

import type { ICellRendererParams } from "ag-grid-community";

import { fetchWithAuth } from "@/lib/fetchWithAuth";
import {
  ClientSideRowModelModule,
  TextFilterModule,
  DateFilterModule,
  NumberFilterModule,
} from "ag-grid-community";
import { ModuleRegistry } from "ag-grid-community";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  TextFilterModule,
  DateFilterModule,
  NumberFilterModule,
]);
interface User {
  id: number;
  username: string;
}
interface OrganizationalUnit {
  id: number;
  name: string;
}
interface SecuredObjectType {
  id: number;
  code: string;
  label: string;
}
interface PermissionType {
  id: number;
  name: string;
}
interface UserPermission {
  id: number;
  user: number;
  org_unit: number;
  object_type: number;
  permission: number;
  userName?: string;
  unitName?: string;
  objectLabel?: string;
  permissionName?: string;
}

export default function PermissionsPage() {
  const [rowData, setRowData] = useState<UserPermission[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [units, setUnits] = useState<OrganizationalUnit[]>([]);
  const [objects, setObjects] = useState<SecuredObjectType[]>([]);
  const [permissions, setPermissions] = useState<PermissionType[]>([]);

  const [formState, setFormState] = useState({
    user: "" as number | "",
    orgUnit: "" as number | "",
    objectType: "" as number | "",
    permission: "" as number | "",
    loading: false,
  });

  const loadPermissions = useCallback(() => {
    Promise.all([
      fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/api/permissions/user/`
      ).then((res) => res.json()),
      fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/users/`).then(
        (res) => res.json()
      ),
      fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/orgunits/`).then(
        (res) => res.json()
      ),
      fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/api/permissions/types/`
      ).then((res) => res.json()),
      fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/api/permissions/objects/`
      ).then((res) => res.json()),
    ]).then(([permissionsRaw, usersRaw, unitsRaw, typesRaw, objectsRaw]) => {
      setUsers(usersRaw);
      setUnits(unitsRaw);
      setPermissions(typesRaw);
      setObjects(objectsRaw);

      const mapped = permissionsRaw.map((perm: UserPermission) => ({
        ...perm,
        userName:
          (usersRaw as User[]).find((u: User) => u.id === perm.user)
            ?.username || String(perm.user),
        unitName:
          (unitsRaw as OrganizationalUnit[]).find(
            (u: OrganizationalUnit) => u.id === perm.org_unit
          )?.name || String(perm.org_unit),
        objectLabel:
          (objectsRaw as SecuredObjectType[]).find(
            (o: SecuredObjectType) => o.id === perm.object_type
          )?.label || String(perm.object_type),
        permissionName:
          (typesRaw as PermissionType[]).find(
            (p: PermissionType) => p.id === perm.permission
          )?.name || String(perm.permission),
      }));
      setRowData(mapped);
    });
  }, []);

  useEffect(() => {
    loadPermissions();
  }, [loadPermissions]);

  const handleDelete = async (id: number) => {
    if (!confirm("Czy na pewno chcesz usunąć to uprawnienie?")) return;
    const res = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_API_URL}/api/permissions/user/${id}/`,
      {
        method: "DELETE",
      }
    );
    if (res.ok) {
      loadPermissions();
    } else {
      alert("Nie udało się usunąć uprawnienia.");
    }
  };

  const colDefs: ColDef<UserPermission>[] = [
    {
      field: "userName",
      headerName: "Użytkownik",
      filter: "agTextColumnFilter",
      floatingFilter: true,
    },
    {
      field: "unitName",
      headerName: "Jednostka",
      filter: "agTextColumnFilter",
      floatingFilter: true,
    },
    {
      field: "objectLabel",
      headerName: "Obiekt",
      filter: "agTextColumnFilter",
      floatingFilter: true,
    },
    {
      field: "permissionName",
      headerName: "Uprawnienie",
      filter: "agTextColumnFilter",
      floatingFilter: true,
    },
    {
      headerName: "Akcje",
      cellRenderer: ({ data }: ICellRendererParams<UserPermission>) => {
        if (!data?.id) return null;
        return (
          <button
            className="text-red-600 hover:underline"
            onClick={() => handleDelete(data.id)}
          >
            Usuń
          </button>
        );
      },

      width: 100,
    },
  ];

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const { user, orgUnit, objectType, permission } = formState;

    if ([user, orgUnit, objectType, permission].includes("")) {
      alert("Wszystkie pola są wymagane.");
      return;
    }

    setFormState((s) => ({ ...s, loading: true }));

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

    if (res.ok) {
      setFormState({
        user: "",
        orgUnit: "",
        objectType: "",
        permission: "",
        loading: false,
      });
      loadPermissions();
    } else {
      const error = await res.json();
      alert("Błąd dodawania: " + JSON.stringify(error));
      setFormState((s) => ({ ...s, loading: false }));
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Zarządzanie uprawnieniami użytkowników
      </h1>

      <form
        onSubmit={handleAdd}
        className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-2"
      >
        <select
          required
          value={formState.user}
          onChange={(e) =>
            setFormState((s) => ({ ...s, user: Number(e.target.value) }))
          }
          className="border p-1"
        >
          <option value="">Użytkownik</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.username}
            </option>
          ))}
        </select>

        <select
          required
          value={formState.orgUnit}
          onChange={(e) =>
            setFormState((s) => ({ ...s, orgUnit: Number(e.target.value) }))
          }
          className="border p-1"
        >
          <option value="">Jednostka</option>
          {units.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>

        <select
          required
          value={formState.objectType}
          onChange={(e) =>
            setFormState((s) => ({ ...s, objectType: Number(e.target.value) }))
          }
          className="border p-1"
        >
          <option value="">Obiekt</option>
          {objects.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>

        <select
          required
          value={formState.permission}
          onChange={(e) =>
            setFormState((s) => ({ ...s, permission: Number(e.target.value) }))
          }
          className="border p-1"
        >
          <option value="">Uprawnienie</option>
          {permissions.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="col-span-full bg-blue-600 hover:bg-blue-800 text-white font-bold py-1 px-4 rounded"
          disabled={formState.loading}
        >
          {formState.loading ? "Dodawanie..." : "Dodaj uprawnienie"}
        </button>
      </form>

      <div className="ag-theme-quartz" style={{ height: 600 }}>
        <AgGridReact<UserPermission>
          rowData={rowData}
          columnDefs={colDefs}
          modules={[
            ClientSideRowModelModule,
            TextFilterModule,
            DateFilterModule,
            NumberFilterModule,
          ]}
          defaultColDef={{
            flex: 1,
            resizable: true,
            filter: true,
            floatingFilter: true,
          }}
          floatingFiltersHeight={30}
        />
      </div>
    </div>
  );
}
