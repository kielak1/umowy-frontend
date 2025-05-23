"use client";

import { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ClientSideRowModelModule,
  ValidationModule,
  TextFilterModule,
  TextEditorModule,
  SelectEditorModule,
  CheckboxEditorModule,
  CellStyleModule,
  RowAutoHeightModule,
  ModuleRegistry,
  ColDef,
  CellValueChangedEvent,
} from "ag-grid-community";

import { fetchWithAuth } from "@/lib/fetchWithAuth";
import "ag-grid-community/styles/ag-theme-quartz.css";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ValidationModule,
  TextFilterModule,
  TextEditorModule,
  SelectEditorModule,
  CheckboxEditorModule,
  CellStyleModule,
  RowAutoHeightModule,
]);
import { Trash2 } from "lucide-react";

interface UserProfile {
  source: "local" | "ad" | "oidc";
  default_page: string | null;
}

interface UserRow {
  id: number;
  username: string;
  email: string;
  profile: UserProfile;
  password?: string;
}

export default function AdminUsersPage() {
  const [rowData, setRowData] = useState<UserRow[]>([]);

  useEffect(() => {
    fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/users/`)
      .then((res) => res.json())
      .then(setRowData);
  }, []);

  const columnDefs: ColDef[] = [
    { field: "username", editable: true },
    { field: "email", editable: true },
    {
      headerName: "source",
      field: "profile.source",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: ["local", "ad", "oidc"],
      },
    },
    {
      headerName: "default_page",
      field: "profile.default_page",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: ["/", "/contracts", "/admin/permissions"],
      },
    },
    {
      headerName: "nowe hasło",
      field: "password",
      editable: true,
      cellRenderer: () => "••••••",
    },
    {
      headerName: "",
      field: "delete",
      cellRenderer: (params: { data: UserRow }) => {
        const handleClick = async () => {
          const confirmed = window.confirm(
            `Czy na pewno chcesz usunąć użytkownika ${params.data.username}?`
          );
          if (!confirmed) return;

          await fetchWithAuth(
            `${process.env.NEXT_PUBLIC_API_URL}/api/users/${params.data.id}/`,
            { method: "DELETE" }
          );
          setRowData((prev) => prev.filter((u) => u.id !== params.data.id));
        };

        return (
          <button
            onClick={handleClick}
            className="text-red-600 p-1 rounded hover:bg-red-100"
            title="Usuń użytkownika"
          >
            <Trash2 size={16} strokeWidth={1.5} />
          </button>
        );
      },
      width: 58,
      flex: 0,
    },
  ];

  const onCellValueChanged = async (event: CellValueChangedEvent<UserRow>) => {
    const { data } = event;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      alert("Niepoprawny adres e-mail. Nie został zapisany.");
      return;
    }
    const updatePayload: Partial<UserRow> = {
      username: data.username,
      email: data.email,
      profile: {
        source: data.profile?.source ?? "local",
        default_page: data.profile?.default_page ?? null,
      },
    };

    if (typeof data.password === "string" && data.password.length >= 8) {
      updatePayload.password = data.password;
    }

    await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/${data.id}/`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload),
      }
    );
  };

  return (
    <div className="p-4">
      <div className="ag-theme-quartz" style={{ height: 800, width: "100%" }}>
        <AgGridReact<UserRow>
          rowData={rowData}
          columnDefs={columnDefs}
          rowModelType="clientSide"
          getRowId={(params) => String(params.data.id)}
          onCellValueChanged={onCellValueChanged}
          defaultColDef={{
            flex: 1,
            minWidth: 50,
            resizable: true,
            filter: true,
          }}
        />
      </div>
    </div>
  );
}
