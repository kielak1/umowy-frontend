"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { AgGridReact } from "ag-grid-react";
// import { ClientSideRowModelModule, ValidationModule } from "ag-grid-community";
import {
  ClientSideRowModelModule,
  ValidationModule,
  TextFilterModule,
  DateFilterModule,
  TextEditorModule,
  DateEditorModule,
  SelectEditorModule,
} from "ag-grid-community";

// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-quartz.css";

interface Kontrahent {
  id: number;
  nazwa_kontrahenta: string;
}

interface Umowa {
  id: number;
  numer: string;
  przedmiot: string;
  data_zawarcia: string;
  czy_wymaga_kontynuacji: boolean;
  wymagana_data_zawarcia_kolejnej_umowy: string | null;
  czy_spelnia_wymagania_dora: boolean;
  kontrahent: Kontrahent | null;
}

export default function Home() {
  const [rowData, setRowData] = useState<Umowa[]>([]);
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/umowy/`;

  const fetchData = useCallback(() => {
    fetch(apiUrl)
      .then((res) => res.json())
      .then(setRowData)
      .catch((err) => console.error(err));
  }, [apiUrl]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onCellValueChanged = useCallback(
    (params: any) => {
      fetch(`${apiUrl}${params.data.id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params.data),
      }).catch((err) => {
        console.error(err);
        alert("Wystąpił błąd podczas zapisywania zmian");
        fetchData();
      });
    },
    [apiUrl, fetchData]
  );

  const colDefs = [
    {
      headerName: "Numer",
      field: "numer",
      sortable: true,
      filter: true,
      editable: true,
    },
    {
      headerName: "Przedmiot",
      field: "przedmiot",
      sortable: true,
      filter: true,
      editable: true,
    },
    {
      headerName: "Data zawarcia",
      field: "data_zawarcia",
      sortable: true,
      filter: "agDateColumnFilter",
      editable: true,
      cellEditor: "agDateStringCellEditor",
    },
    {
      headerName: "Czy wymaga kontynuacji",
      field: "czy_wymaga_kontynuacji",
      sortable: true,
      filter: true,
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: { values: [true, false] },
    },
    {
      headerName: "Wymagana data kolejnej umowy",
      field: "wymagana_data_zawarcia_kolejnej_umowy",
      sortable: true,
      filter: "agDateColumnFilter",
      editable: true,
      cellEditor: "agDateStringCellEditor",
    },
    {
      headerName: "Czy spełnia wymagania DORA",
      field: "czy_spelnia_wymagania_dora",
      sortable: true,
      filter: true,
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: { values: [true, false] },
    },
    {
      headerName: "Kontrahent",
      field: "kontrahent.nazwa_kontrahenta",
      sortable: true,
      filter: true,
      editable: false,
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Lista umów</h1>
        <Link href="/nowa-umowa">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Dodaj nową umowę
          </button>
        </Link>
      </div>

      <div
        className="ag-theme-quartz"
        style={{ height: "500px", width: "100%" }}
      >
        <AgGridReact
          modules={[
            ClientSideRowModelModule,
            ValidationModule,
            TextFilterModule,
            DateFilterModule,
            TextEditorModule,
            DateEditorModule,
            SelectEditorModule,
          ]}
          rowData={rowData}
          columnDefs={colDefs}
          defaultColDef={{
            flex: 1,
            minWidth: 120,
            resizable: true,
          }}
          onCellValueChanged={onCellValueChanged}
        />
      </div>
    </div>
  );
}
