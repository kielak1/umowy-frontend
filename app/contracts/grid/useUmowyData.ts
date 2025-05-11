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
    async (params: CellValueChangedEvent<Umowa>) => {
      const { data, colDef } = params;
      if (!data || data.id < 0) return;

      const pole = colDef.field;
      if (pole?.startsWith("najnowsza_zmiana.")) {
        const subField = pole.split(".")[1];
        const zmiana = data.najnowsza_zmiana;
        if (!zmiana || !zmiana.id) {
          console.warn("Brak identyfikatora najnowszej zmiany – nie zapisuję");
          return;
        }

        const payload = { [subField]: zmiana[subField as keyof typeof zmiana] };
        try {
          await fetchWithAuth(
            `${process.env.NEXT_PUBLIC_API_URL}/api/zmiany/${zmiana.id}/`,
            {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            }
          );
        } catch (err) {
          console.error("Błąd zapisu zmiany:", err);
          alert("Błąd podczas zapisu pola zmiany");
          fetchData(); // odśwież dane
        }
        return;
      }

      // standardowy zapis umowy
      try {
        await fetchWithAuth(`${apiUrl}${data.id}/`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      } catch (err) {
        console.error(err);
        alert("Wystąpił błąd podczas zapisywania");
        fetchData();
      }
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
