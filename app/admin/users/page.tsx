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
    },
    {
      headerName: "nowe hasło",
      field: "password",
      editable: true,
      cellRenderer: () => "••••••",
    },
    {
      headerName: "",
      cellRenderer: (params: { data: UserRow }) => {
        const handleClick = async () => {
          const confirmed = window.confirm(
            `Czy na pewno chcesz usunąć użytkownika ${params.data.username}?`
          );
          if (!confirmed) return;

          await fetchWithAuth(
            `${process.env.NEXT_PUBLIC_API_URL}/api/users/${params.data.id}/`,
            {
              method: "DELETE",
            }
          );
          setRowData((prev) => prev.filter((u) => u.id !== params.data.id));
        };

        return (
          <button
            onClick={handleClick}
            className="text-red-600 border px-2 py-1 rounded border-red-600 hover:bg-red-100"
          >
            Usuń
          </button>
        );
      },
    },
  ];

  const onCellValueChanged = async (event: CellValueChangedEvent<UserRow>) => {
    const { data } = event;

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
            minWidth: 150,
            resizable: true,
            filter: true,
          }}
        />
      </div>
    </div>
  );
}
