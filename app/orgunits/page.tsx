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
import { Trash2 } from "lucide-react";

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

interface OrgUnit {
  id: number;
  name: string;
  parent: number | null;
}

export default function OrgUnitsPage() {
  const [rowData, setRowData] = useState<OrgUnit[]>([]);

  useEffect(() => {
    fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/orgunits/`)
      .then((res) => res.json())
      .then(setRowData);
  }, []);

  const columnDefs: ColDef[] = [
    {
      headerName: "Nazwa",
      field: "name",
      editable: true,
    },
    {
      headerName: "ID jednostki nadrzędnej",
      field: "parent",
      editable: true,
      cellEditor: "agTextCellEditor",
    },
    {
      headerName: "",
      field: "delete",
      cellRenderer: (params: { data: OrgUnit }) => {
        const handleClick = async () => {
          const confirmed = window.confirm(
            `Czy na pewno chcesz usunąć jednostkę "${params.data.name}"?`
          );
          if (!confirmed) return;

          await fetchWithAuth(
            `${process.env.NEXT_PUBLIC_API_URL}/api/orgunits/${params.data.id}/`,
            { method: "DELETE" }
          );
          setRowData((prev) => prev.filter((u) => u.id !== params.data.id));
        };

        return (
          <button
            onClick={handleClick}
            className="text-red-600 p-1 rounded hover:bg-red-100"
            title="Usuń jednostkę"
          >
            <Trash2 size={16} strokeWidth={1.5} />
          </button>
        );
      },
      width: 58,
      flex: 0,
    },
  ];

  const onCellValueChanged = async (event: CellValueChangedEvent<OrgUnit>) => {
    const { data } = event;

    const payload = {
      name: data.name,
      parent: data.parent,
    };

    await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_API_URL}/api/orgunits/${data.id}/`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
  };

  const addOrgUnit = async () => {
    const name = prompt("Podaj nazwę nowej jednostki:");
    if (!name?.trim()) return;

    const res = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_API_URL}/api/orgunits/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      }
    );

    if (res.ok) {
      const newUnit = await res.json();
      setRowData((prev) => [...prev, newUnit]);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-2">
        <button
          onClick={addOrgUnit}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          Dodaj jednostkę
        </button>
      </div>
      <div className="ag-theme-quartz" style={{ height: 800, width: "100%" }}>
        <AgGridReact<OrgUnit>
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
