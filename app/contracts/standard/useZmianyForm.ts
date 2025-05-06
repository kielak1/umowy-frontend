"use client";

import { useState, useEffect } from "react";
import { ZmianaUmowaDoForm, ZmianaUmowy } from "@/app/contracts/grid/types";
import { serializeZmianyDoZapisania } from "./lib/serializeZmianyDoZapisania";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

function mapToForm(z: ZmianaUmowy, umowaId: number): ZmianaUmowaDoForm {
  return {
    id: z.id,
    rodzaj: z.rodzaj,
    data_zawarcia: z.data_zawarcia,
    data_obowiazywania_od: z.data_obowiazywania_od,
    data_obowiazywania_do: z.data_obowiazywania_do,
    kwota_netto: z.kwota_netto ?? "",
    waluta: z.waluta,
    opis: z.opis,
    przedmiot: z.przedmiot,
    producenci: z.producenci,
    numer_umowy_dostawcy: z.numer_umowy_dostawcy,
    kategoria_id: z.kategoria?.id ?? null,
    wlasciciel_id: z.wlasciciel?.id ?? null,
    status_id: z.status?.id ?? null,
    klasyfikacja_id: z.klasyfikacja?.id ?? null,
    obszary_funkcjonalne_ids: z.obszary_funkcjonalne?.map((o) => o.id) ?? [],
    data_podpisania: z.data_podpisania,
    data_wypowiedzenia: z.data_wypowiedzenia,
    trzeba_wypowiedziec: z.trzeba_wypowiedziec,
    finansowanie_do: z.finansowanie_do,
    umowa: umowaId,
  };
}

export function useZmianyForm(zmianyWejsciowe: ZmianaUmowy[], umowaId: number) {
  const [zmiany, setZmiany] = useState<ZmianaUmowaDoForm[]>(
    zmianyWejsciowe.map((z) => mapToForm(z, umowaId))
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setZmiany(zmianyWejsciowe.map((z) => mapToForm(z, umowaId)));
  }, [zmianyWejsciowe, umowaId]);

  const zapiszZmiany = async () => {
    setLoading(true);
    setError(null);
    try {
      const prepared = serializeZmianyDoZapisania(zmiany);
      const responses = await Promise.all(
        prepared.map((z) =>
          z.id
            ? fetchWithAuth(
                `${process.env.NEXT_PUBLIC_API_URL}/api/zmiany/${z.id}/`,
                {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(z),
                }
              )
            : fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/zmiany/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(z),
              })
        )
      );
      const failed = responses.find((r) => !r.ok);
      if (failed) throw new Error("Nie udało się zapisać niektórych zmian");
      return true;
    } catch (err) {
      console.error(err);
      setError("Błąd podczas zapisu zmian");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (index: number, updated: ZmianaUmowaDoForm) => {
    const updatedList = [...zmiany];
    updatedList[index] = updated;
    setZmiany(updatedList);
  };

  const handleDelete = (index: number) => {
    const updatedList = [...zmiany];
    updatedList.splice(index, 1);
    setZmiany(updatedList);
  };

  const handleAdd = () => {
    setZmiany((prev) => [
      ...prev,
      {
        id: Date.now(),
        rodzaj: "umowa",
        data_zawarcia: "",
        data_obowiazywania_od: "",
        data_obowiazywania_do: null,
        kwota_netto: "",
        waluta: "PLN",
        opis: "",
        przedmiot: null,
        producenci: null,
        numer_umowy_dostawcy: null,
        kategoria_id: null,
        wlasciciel_id: null,
        status_id: null,
        klasyfikacja_id: null,
        obszary_funkcjonalne_ids: [],
        data_podpisania: null,
        data_wypowiedzenia: null,
        trzeba_wypowiedziec: false,
        finansowanie_do: null,
        umowa: umowaId,
      },
    ]);
  };

  return {
    zmiany,
    setZmiany,
    zapiszZmiany,
    loading,
    error,
    handleZmianaChange: handleChange,
    handleZmianaDelete: handleDelete,
    handleZmianaAdd: handleAdd,
  };
}
