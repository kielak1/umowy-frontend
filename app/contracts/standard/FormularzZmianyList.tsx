"use client";

import FormularzZmiana from "./FormularzZmiana";
import { ZmianaUmowaDoForm } from "@/app/contracts/grid/types";

type Props = {
  zmiany: ZmianaUmowaDoForm[];
  onChange: (index: number, updated: ZmianaUmowaDoForm) => void;
  onDelete: (index: number) => void;
  onAdd: () => void;
};

export default function FormularzZmianyList({
  zmiany,
  onChange,
  onDelete,
  onAdd,
}: Props) {
  return (
    <div className="space-y-4 mt-8">
      <h2 className="text-lg font-semibold">Zmiany umowy</h2>

      {zmiany.map((zm, idx) => (
        <FormularzZmiana
          key={zm.id}
          index={idx}
          zmiana={zm}
          onChange={onChange}
          onDelete={onDelete}
        />
      ))}

      <button
        type="button"
        onClick={onAdd}
        className="text-blue-600 underline text-sm"
      >
        + Dodaj zmianę
      </button>
    </div>
  );
}
