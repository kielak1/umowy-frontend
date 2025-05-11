"use client";

import { useCallback, useEffect } from "react";
import { CellValueChangedEvent, RowHeightParams } from "ag-grid-community";
import { Umowa, ZmianaUmowy } from "./types";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export function useContractsGridData(
  setRowData: React.Dispatch<React.SetStateAction<Umowa[]>>
) {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/umowy/`;

  const fetchData = useCallback(() => {
    fetchWithAuth(apiUrl)
      .then((res) => res.json())
      .then((data: Umowa[]) =>
        setRowData(data.map((row) => ({ ...row, _expanded: false })))
      )
      .catch(console.error);
  }, [apiUrl, setRowData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onCellValueChanged = useCallback(
    async (params: CellValueChangedEvent<Umowa>) => {
      const { data, colDef, newValue, oldValue } = params;
      if (!data || data.id < 0 || !colDef.field) return;

      const pole = colDef.field;

      console.log("🔄 onCellValueChanged fired:");
      console.log("🧩 field:", pole);
      console.log("📤 newValue:", newValue, typeof newValue);
      console.log("📥 oldValue:", oldValue, typeof oldValue);
      console.log("🔢 data before patch:", data);

      // 🔁 przypadek: zmiana
      if (pole.startsWith("najnowsza_zmiana.")) {
        const zmiana = data.najnowsza_zmiana;
        if (!zmiana || !zmiana.id) {
          console.warn("Brak identyfikatora zmiany – nie zapisuję");
          return;
        }

        const subField = pole.split(".")[1] as keyof ZmianaUmowy;
        const payload: Partial<Record<string, unknown>> = {};

        if (pole === "najnowsza_zmiana.status.id") {
          payload["status_id"] = Number(newValue);
        } else {
          payload[subField] = zmiana[subField];
        }

        try {
          const res = await fetchWithAuth(
            `${process.env.NEXT_PUBLIC_API_URL}/api/zmiany/${zmiana.id}/`,
            {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            }
          );

          if (!res.ok) {
            const body = await res.text();
            console.error("❌ Błąd zapisu zmiany:", body);
            alert("Błąd zapisu pola zmiany");
          } else {
            fetchData();
          }
        } catch (err) {
          console.error("❌ Błąd zapisu zmiany:", err);
          fetchData();
        }

        return;
      }

      // 📄 przypadek: dane główne umowy (w tym słownikowe)
      const payload: Partial<Umowa> & {
        kontrahent_id?: number;
        opiekun_id?: number;
        jednostka_organizacyjna_id?: number;
      } = {};

      switch (pole) {
        case "kontrahent.id":
          payload.kontrahent_id = Number(newValue);
          break;
        case "opiekun.id":
          payload.opiekun_id = Number(newValue);
          break;
        case "jednostka_organizacyjna.id":
          payload.jednostka_organizacyjna_id = Number(newValue);
          break;
        default:
          if (Object.prototype.hasOwnProperty.call(data, pole)) {
            const klucz = pole as keyof Umowa;
            const wartosc = data[klucz];

            // ⛔ jeśli typeof wartosc === "function", odrzucamy
            if (typeof wartosc !== "function") {
              (payload as Record<keyof Umowa, unknown>)[klucz] = wartosc;
            }
          }
      }

      try {
        const res = await fetchWithAuth(`${apiUrl}${data.id}/`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const body = await res.text();
          console.error("❌ Błąd zapisu umowy:", body);
          alert("Błąd zapisu danych umowy");
        } else {
          fetchData();
        }
      } catch (err) {
        console.error("❌ Błąd zapisu umowy:", err);
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
