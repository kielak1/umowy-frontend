"use client";

import { useState, useEffect } from "react";
import { ZmianaUmowy } from "@/app/contracts/grid/types";
import FormularzZmiana from "./FormularzZmiana";

type Props = {
  initialZmiany: ZmianaUmowy[];
};

export default function FormularzZmianyList({ initialZmiany }: Props) {
  const [zmiany, setZmiany] = useState<ZmianaUmowy[]>([]);

  // WAŻNE: aktualizacja stanu przy zmianie initialZmiany
  useEffect(() => {
    setZmiany(initialZmiany);
  }, [initialZmiany]);

  const handleChange = (index: number, updated: ZmianaUmowy) => {
    const kopia = [...zmiany];
    kopia[index] = updated;
    setZmiany(kopia);
  };

  const handleDelete = (index: number) => {
    const nowaLista = [...zmiany];
    nowaLista.splice(index, 1);
    setZmiany(nowaLista);
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
        producenci: null,
        przedmiot: null,
        numer_umowy_dostawcy: null,
        kategoria: null,
        obszary_funkcjonalne: [],
        wlasciciel: null,
        data_podpisania: null,
        data_wypowiedzenia: null,
        trzeba_wypowiedziec: false,
        status: null,
        finansowanie_do: null,
        klasyfikacja: null,
        umowa: 0,
      },
    ]);
  };

  return (
    <div className="space-y-4 mt-8">
      <h2 className="text-lg font-semibold">Zmiany umowy</h2>

      {zmiany.map((zm, idx) => (
        <FormularzZmiana
          key={zm.id}
          index={idx}
          zmiana={zm}
          onChange={handleChange}
          onDelete={handleDelete}
        />
      ))}

      <button
        type="button"
        onClick={handleAdd}
        className="text-blue-600 underline text-sm"
      >
        + Dodaj zmianę
      </button>
    </div>
  );
}
