"use client";

import { useState, useEffect } from "react";
import { Zamowienie, ZamowienieDoForm } from "@/app/contracts/grid/types";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export function useZamowieniaForm(
  zamowieniaWejsciowe: Zamowienie[],
  umowaId: number
) {
  const [zamowienia, setZamowienia] = useState<ZamowienieDoForm[]>(
    zamowieniaWejsciowe.map((z) => ({ ...z })) as ZamowienieDoForm[]
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setZamowienia(
      zamowieniaWejsciowe.map((z) => ({ ...z })) as ZamowienieDoForm[]
    );
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
      const updatedList: ZamowienieDoForm[] = [];

      for (const z of zamowienia) {
        const method = z.id ? "PATCH" : "POST";
        const url =
          method === "PATCH"
            ? `${process.env.NEXT_PUBLIC_API_URL}/api/zamowienia/${z.id}/`
            : `${process.env.NEXT_PUBLIC_API_URL}/api/zamowienia/`;

        const res = await fetchWithAuth(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(z),
        });

        if (!res.ok) {
          const body = await res.text();
          console.error("❌ Błąd zapisu zamówienia:", z, body);
          throw new Error("Nie udało się zapisać niektórych zamówień");
        }

        const saved = await res.json();
        updatedList.push({ ...saved });
      }

      // 🔄 aktualizacja lokalnego stanu bez dublowania
      setZamowienia((prev) =>
        prev.map((z) => {
          const match = updatedList.find(
            (u) =>
              u.id === z.id ||
              (!z.id && u.numer_zamowienia === z.numer_zamowienia)
          );
          return match ?? z;
        })
      );

      return true;
    } catch (err) {
      console.error(err);
      setError("Błąd podczas zapisu zamówień");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (index: number, updated: ZamowienieDoForm) => {
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
