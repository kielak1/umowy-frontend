"use client";

import { useState, useEffect } from "react";
import { Zamowienie } from "@/app/contracts/grid/types";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export function useZamowieniaForm(
  zamowieniaWejsciowe: Zamowienie[],
  umowaId: number
) {
  const [zamowienia, setZamowienia] =
    useState<Zamowienie[]>(zamowieniaWejsciowe);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setZamowienia(zamowieniaWejsciowe);
  }, [zamowieniaWejsciowe]);

  const zapiszZamowienia = async () => {
    setLoading(true);
    setError(null);

    const niepoprawne = zamowienia.filter(
      (z) =>
        !z.numer_zamowienia ||
        !z.data_zlozenia ||
        z.kwota_netto === null ||
        z.kwota_netto === ""
    );

    if (niepoprawne.length > 0) {
      setError("Uzupełnij wymagane pola we wszystkich zamówieniach");
      setLoading(false);
      return false;
    }

    try {
      const responses = await Promise.all(
        zamowienia.map((z) => {
          const method = z.id && z.id > 0 ? "PATCH" : "POST";
          const payload = { ...z, umowa: umowaId };
          return method === "PATCH"
            ? fetchWithAuth(
                `${process.env.NEXT_PUBLIC_API_URL}/api/zamowienia/${z.id}/`,
                {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(payload),
                }
              )
            : fetchWithAuth(
                `${process.env.NEXT_PUBLIC_API_URL}/api/zamowienia/`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(payload),
                }
              );
        })
      );

      const failed = responses.find((r) => !r.ok);
      if (failed) {
        const idx = responses.findIndex((r) => r === failed);
        const body = await failed.text();
        console.error("❌ Błąd zapisu zamówień:", zamowienia[idx], body);
        throw new Error("Nie udało się zapisać niektórych zamówień");
      }

      return true;
    } catch (err) {
      console.error(err);
      setError("Błąd podczas zapisu zamówień");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (index: number, updated: Zamowienie) => {
    const kopia = [...zamowienia];
    kopia[index] = updated;
    setZamowienia(kopia);
  };

  const handleDelete = (index: number) => {
    const kopia = [...zamowienia];
    kopia.splice(index, 1);
    setZamowienia(kopia);
  };

  const handleAdd = () => {
    setZamowienia((prev) => [
      ...prev,
      {
        id: Date.now(),
        numer_zamowienia: "",
        data_zlozenia: "",
        data_realizacji: null,
        kwota_netto: "",
        waluta: "PLN",
        opis: "",
        przedmiot: null,
        producenci: null,
        umowa: umowaId,
      },
    ]);
  };

  return {
    zamowienia,
    handleZamowienieChange: handleChange,
    handleZamowienieDelete: handleDelete,
    handleZamowienieAdd: handleAdd,
    zapiszZamowienia,
    loading,
    error,
  };
}
