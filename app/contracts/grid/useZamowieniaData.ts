"use client";

import { useEffect, useState, useCallback } from "react";
import { Zamowienie } from "./types";
import { CellValueChangedEvent } from "ag-grid-community";

export function useZamowieniaData(umowaId: number) {
  const [rowData, setRowData] = useState<Zamowienie[]>([]);
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/zamowienia/?umowa_id=${umowaId}`;

  const fetchData = useCallback(() => {
    fetch(apiUrl)
      .then((res) => res.json())
      .then(setRowData)
      .catch(console.error);
  }, [apiUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onCellValueChanged = useCallback(
    (params: CellValueChangedEvent<Zamowienie>) => {
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/zamowienia/${params.data.id}/`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(params.data),
        }
      ).catch((err) => {
        console.error(err);
        alert("Wystąpił błąd podczas zapisywania");
        fetchData();
      });
    },
    [fetchData]
  );

  return { rowData, onCellValueChanged };
}
