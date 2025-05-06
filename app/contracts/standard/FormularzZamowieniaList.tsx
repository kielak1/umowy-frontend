"use client";

import { useState, useEffect } from "react";
import { Zamowienie } from "@/app/contracts/grid/types";
import FormularzZamowienie from "./FormularzZamowienie";

type Props = {
  initialZamowienia: Zamowienie[];
};

export default function FormularzZamowieniaList({ initialZamowienia }: Props) {
  const [zamowienia, setZamowienia] = useState<Zamowienie[]>([]);

  useEffect(() => {
    setZamowienia(initialZamowienia);
  }, [initialZamowienia]);

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
        umowa: 0,
      },
    ]);
  };

  return (
    <div className="space-y-4 mt-8">
      <h2 className="text-lg font-semibold">Zamówienia</h2>

      {zamowienia.map((zam, idx) => (
        <FormularzZamowienie
          key={zam.id}
          index={idx}
          zamowienie={zam}
          onChange={handleChange}
          onDelete={handleDelete}
        />
      ))}

      <button
        type="button"
        onClick={handleAdd}
        className="text-blue-600 underline text-sm"
      >
        + Dodaj zamówienie
      </button>
    </div>
  );
}
