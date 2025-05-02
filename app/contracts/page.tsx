"use client";

import { useEffect, useState, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ClientSideRowModelModule,
  ValidationModule,
  TextFilterModule,
  DateFilterModule,
  TextEditorModule,
  DateEditorModule,
  SelectEditorModule,
  CellValueChangedEvent,
  ColDef,
} from "ag-grid-community";

interface Kontrahent {
  id: number;
  nazwa: string;
}
interface User {
  id: number;
  username: string;
}
interface OrganizationalUnit {
  id: number;
  name: string;
}
interface ZmianaUmowy {
  data_zawarcia: string;
  kwota_netto: string;
  waluta: string;
}
interface Umowa {
  id: number;
  numer: string;
  czy_ramowa: boolean;
  czy_dotyczy_konkretnych_uslug: boolean;
  czy_spelnia_dora: boolean;
  czy_wymaga_kontynuacji: boolean;
  wymagana_data_kontynuacji: string | null;
  kontrahent: Kontrahent | null;
  opiekun: User | null;
  jednostka_organizacyjna: OrganizationalUnit | null;
  najnowsza_zmiana: ZmianaUmowy | null;
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
    (params: CellValueChangedEvent<Umowa>) => {
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

  const colDefs: ColDef<Umowa>[] = [
    {
      headerName: "Numer",
      field: "numer",
      sortable: true,
      filter: "agTextColumnFilter",
      editable: true,
    },
    {
      headerName: "Czy ramowa",
      field: "czy_ramowa",
      sortable: true,
      filter: true,
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: { values: [true, false] },
    },
    {
      headerName: "Czy dot. usługi/produktu",
      field: "czy_dotyczy_konkretnych_uslug",
      sortable: true,
      filter: true,
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: { values: [true, false] },
    },
    {
      headerName: "Czy spełnia DORA",
      field: "czy_spelnia_dora",
      sortable: true,
      filter: true,
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: { values: [true, false] },
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
      headerName: "Wymagana data kolejnej",
      field: "wymagana_data_kontynuacji",
      sortable: true,
      filter: "agDateColumnFilter",
      editable: true,
      cellEditor: "agDateStringCellEditor",
    },
    {
      headerName: "Data zawarcia (ostatnia)",
      field: "najnowsza_zmiana.data_zawarcia",
      sortable: true,
      filter: "agDateColumnFilter",
      editable: false,
    },
    {
      headerName: "Kwota netto (ostatnia)",
      field: "najnowsza_zmiana.kwota_netto",
      sortable: true,
      filter: true,
      editable: false,
    },
    {
      headerName: "Waluta",
      field: "najnowsza_zmiana.waluta",
      sortable: true,
      filter: "agTextColumnFilter",
      editable: false,
    },
    {
      headerName: "Kontrahent",
      field: "kontrahent.nazwa",
      sortable: true,
      filter: "agTextColumnFilter",
      editable: false,
    },
    {
      headerName: "Opiekun",
      field: "opiekun.username",
      sortable: true,
      filter: "agTextColumnFilter",
      editable: false,
    },
    {
      headerName: "Jednostka",
      field: "jednostka_organizacyjna.name",
      sortable: true,
      filter: "agTextColumnFilter",
      editable: false,
    },
  ];

  return (
    <div className="p-4">
      <div
        className="ag-theme-quartz"
        style={{ height: "800px", width: "100%" }}
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
          defaultColDef={{ flex: 1, minWidth: 120, resizable: true }}
          onCellValueChanged={onCellValueChanged}
        />
      </div>
    </div>
  );
}
