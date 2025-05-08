"use client";

import { useZamowieniaForm } from "./useZamowieniaForm";
import FormularzZamowienie from "./FormularzZamowienie";
import { Zamowienie } from "@/app/contracts/grid/types";

type Props = {
  zamowienia: Zamowienie[];
  umowaId: number;
};

export default function FormularzZamowieniaList({
  zamowienia,
  umowaId,
}: Props) {
  const {
    zamowienia: zamowieniaForm,
    handleZamowienieAdd,
    handleZamowienieChange,
    handleZamowienieDelete,
    zapiszZamowienia,
    loading,
    error,
  } = useZamowieniaForm(zamowienia, umowaId);

  const handleZapisz = async () => {
    const ok = await zapiszZamowienia();
    if (ok) alert("Zapisano zamówienia");
  };

  return (
    <div className="space-y-4 mt-8">
      <h2 className="text-lg font-semibold">Zamówienia</h2>

      {zamowieniaForm.map((zam, idx) => (
        <FormularzZamowienie
          key={zam.id ?? `nowe-${idx}`}
          index={idx}
          zamowienie={zam}
          onChange={handleZamowienieChange}
          onDelete={handleZamowienieDelete}
        />
      ))}

      <button
        type="button"
        onClick={handleZamowienieAdd}
        className="text-blue-600 underline text-sm"
      >
        + Dodaj zamówienie
      </button>

      {error && <div className="text-red-600">{error}</div>}

      <button
        type="button"
        onClick={handleZapisz}
        disabled={loading}
        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >
        {loading ? "Zapisywanie..." : "Zapisz zamówienia"}
      </button>
    </div>
  );
}
