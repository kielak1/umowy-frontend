"use client";

import FormularzZmiana from "./FormularzZmiana";
import {
  ZmianaUmowaDoForm,
  SlownikKategoriaUmowy,
  SlownikWlasciciel,
  SlownikStatusUmowy,
  SlownikKlasyfikacjaUmowy,
  SlownikObszarFunkcjonalny,
} from "@/app/contracts/grid/types";

type Props = {
  zmiany: ZmianaUmowaDoForm[];
  onChange: (index: number, updated: ZmianaUmowaDoForm) => void;
  onDelete: (index: number) => void;
  onAdd: () => void;

  // nowe propsy
  kategorie: SlownikKategoriaUmowy[];
  wlasciciele: SlownikWlasciciel[];
  statusy: SlownikStatusUmowy[];
  klasyfikacje: SlownikKlasyfikacjaUmowy[];
  obszary: SlownikObszarFunkcjonalny[];
};

export default function FormularzZmianyList({
  zmiany,
  onChange,
  onDelete,
  onAdd,
  kategorie,
  wlasciciele,
  statusy,
  klasyfikacje,
  obszary,
}: Props) {
  return (
    <div className="space-y-4 mt-8">
      <h2 className="text-lg font-semibold">Zmiany umowy</h2>

      {zmiany.map((zm, idx) => (
        <FormularzZmiana
          key={zm.id ?? `nowa-${idx}`}
          index={idx}
          zmiana={zm}
          onChange={onChange}
          onDelete={onDelete}
          kategorie={kategorie}
          wlasciciele={wlasciciele}
          statusy={statusy}
          klasyfikacje={klasyfikacje}
          obszary={obszary}
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
