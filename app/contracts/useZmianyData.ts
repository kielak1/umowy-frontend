"use client";

import { useEffect, useState, useCallback } from "react";
import { ZmianaUmowy } from "./grid/types";
import type { CellValueChangedEvent } from "ag-grid-community";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export function useZmianyData(umowaId: number) {
  const [rowData, setRowData] = useState<ZmianaUmowy[]>([]);
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/zmiany/?umowa_id=${umowaId}`;

  const fetchData = useCallback(() => {
    fetchWithAuth(apiUrl)
      .then((res) => res.json())
      .then(setRowData)
      .catch(console.error);
  }, [apiUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onCellValueChanged = useCallback(
    (params: CellValueChangedEvent<ZmianaUmowy>) => {
      const { id } = params.data;
      if (!id) return;

      fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/zmiany/${id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params.data),
      })
        .then(fetchData)
        .catch(console.error);
    },
    [fetchData]
  );

  return { rowData, onCellValueChanged };
}
