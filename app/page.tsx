"use client";

import { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ClientSideRowModelModule,
  ValidationModule,
  ModuleRegistry,
} from "ag-grid-community";

import "ag-grid-community/styles/ag-theme-alpine.css";

// Zarejestruj wymagane moduły
ModuleRegistry.registerModules([ClientSideRowModelModule, ValidationModule]);

interface Kontrahent {
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
  kontrahent: Kontrahent;
}

export default function Home() {
  const [rowData, setRowData] = useState<Umowa[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8001/api/umowy/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Błąd podczas pobierania danych");
        }
        return response.json();
      })
      .then((data) => setRowData(data))
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  const columnDefs = [
    { headerName: "Numer", field: "numer" },
    { headerName: "Przedmiot", field: "przedmiot" },
    { headerName: "Data zawarcia", field: "data_zawarcia" },
    { headerName: "Czy wymaga kontynuacji", field: "czy_wymaga_kontynuacji" },
    {
      headerName: "Wymagana data nowej umowy",
      field: "wymagana_data_zawarcia_kolejnej_umowy",
    },
    { headerName: "Czy spełnia DORA", field: "czy_spelnia_wymagania_dora" },
    { headerName: "Kontrahent", field: "kontrahent.nazwa_kontrahenta" },
  ];
  return (
    <div className="ag-theme-alpine" style={{ height: 600, width: "100%" }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        domLayout="autoHeight"
      />
    </div>
  );
}
