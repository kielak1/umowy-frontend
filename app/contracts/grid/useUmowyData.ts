"use client";

import { useCallback, useEffect } from "react";
import { CellValueChangedEvent, RowHeightParams } from "ag-grid-community";
import { Umowa } from "./types";
import { fetchWithAuth } from "@/lib/fetchWithAuth"; 

export function useContractsGridData(
  setRowData: React.Dispatch<React.SetStateAction<Umowa[]>>
) {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/umowy/`;

  const fetchData = useCallback(() => {
    fetchWithAuth(apiUrl)
      .then((res) => res.json())
      .then((data) =>
        setRowData(data.map((row: Umowa) => ({ ...row, _expanded: false })))
      )
      .catch(console.error);
  }, [apiUrl, setRowData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onCellValueChanged = useCallback(
    (params: CellValueChangedEvent<Umowa>) => {
      if (params.data.id < 0) return;

      fetchWithAuth(`${apiUrl}${params.data.id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params.data),
      }).catch((err) => {
        console.error(err);
        alert("Wystąpił błąd podczas zapisywania");
        fetchData();
      });
    },
    [apiUrl, fetchData]
  );

  const getRowHeight = (params: RowHeightParams) =>
    typeof params.data._expanded === "string" ? 260 : undefined;

  return {
    onCellValueChanged,
    getRowHeight,
  };
}
