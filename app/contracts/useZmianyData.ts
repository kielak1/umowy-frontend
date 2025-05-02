"use client";

import { useEffect, useState, useCallback } from "react";
import { ZmianaUmowy } from "./grid/types";

export function useZmianyData(umowaId: number) {
  const [rowData, setRowData] = useState<ZmianaUmowy[]>([]);
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/zmiany/?umowa_id=${umowaId}`;

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
    (params: any) => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/zmiany/${params.data.id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params.data),
      })
        .then(() => fetchData())
        .catch(console.error);
    },
    [fetchData]
  );

  return { rowData, onCellValueChanged };
}
