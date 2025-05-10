"use client";

import FormularzZamowienie from "./FormularzZamowienie";
import { ZamowienieDoForm } from "@/app/contracts/grid/types";

type Props = {
  zamowienia: ZamowienieDoForm[];
  onChange: (index: number, updated: ZamowienieDoForm) => void;
  onDelete: (index: number) => void;
  onAdd: () => void;
  loading: boolean;
  error: string | null;
};

export default function FormularzZamowieniaList({
  zamowienia,
  onChange,
  onDelete,
  onAdd,
  error,
}: Props) {


  return (
    <div className="space-y-4 mt-8">
      <h2 className="text-lg font-semibold">Zamówienia</h2>

      {zamowienia.map((zam, idx) => (
        <FormularzZamowienie
          key={zam.id ?? `nowe-${idx}`}
          index={idx}
          zamowienie={zam}
          onChange={onChange}
          onDelete={onDelete}
        />
      ))}

      <button
        type="button"
        onClick={onAdd}
        className="text-blue-600 underline text-sm"
      >
        + Dodaj zamówienie
      </button>

      {error && <div className="text-red-600">{error}</div>}
    </div>
  );
}
