"use client";

import { Umowa, ZmianaUmowy, Zamowienie } from "@/app/contracts/grid/types";
import { useState } from "react";
import FormularzZmianyList from "./FormularzZmianyList";
import FormularzZamowieniaList from "./FormularzZamowieniaList";

type Props = {
  umowa: Umowa;
  zmiany: ZmianaUmowy[];
  zamowienia: Zamowienie[];
};

export default function FormularzPelnejUmowy({
  umowa,
  zmiany,
  zamowienia,
}: Props) {
  const [formData, setFormData] = useState({
    numer: umowa.numer || "",
    czy_ramowa: umowa.czy_ramowa || false,
    czy_dotyczy_konkretnych_uslug: umowa.czy_dotyczy_konkretnych_uslug || false,
    czy_spelnia_dora: umowa.czy_spelnia_dora || false,
    czy_wymaga_kontynuacji: umowa.czy_wymaga_kontynuacji || false,
    wymagana_data_kontynuacji: umowa.wymagana_data_kontynuacji || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, type, value } = e.target;
    const newValue =
      type === "checkbox" && "checked" in e.target
        ? (e.target as HTMLInputElement).checked
        : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  return (
    <form className="space-y-6">
      <h2 className="text-lg font-semibold">Podstawowe dane umowy</h2>

      <div>
        <label className="block font-medium">Numer</label>
        <input
          type="text"
          name="numer"
          value={formData.numer}
          onChange={handleChange}
          className="border rounded px-2 py-1 w-full"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-medium">Kontrahent</label>
        <span className="text-gray-700">{umowa.kontrahent?.nazwa ?? "—"}</span>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-medium">Opiekun</label>
        <span className="text-gray-700">{umowa.opiekun?.username ?? "—"}</span>
      </div>

      <div className="flex gap-4 flex-wrap">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="czy_ramowa"
            checked={formData.czy_ramowa}
            onChange={handleChange}
          />
          Ramowa
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="czy_dotyczy_konkretnych_uslug"
            checked={formData.czy_dotyczy_konkretnych_uslug}
            onChange={handleChange}
          />
          Dotyczy konkretnych usług
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="czy_spelnia_dora"
            checked={formData.czy_spelnia_dora}
            onChange={handleChange}
          />
          Spełnia DORA
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="czy_wymaga_kontynuacji"
            checked={formData.czy_wymaga_kontynuacji}
            onChange={handleChange}
          />
          Wymaga kontynuacji
        </label>
      </div>

      <div>
        <label className="block font-medium">Data kontynuacji</label>
        <input
          type="date"
          name="wymagana_data_kontynuacji"
          value={formData.wymagana_data_kontynuacji ?? ""}
          onChange={handleChange}
          className="border rounded px-2 py-1"
        />
      </div>

      <FormularzZmianyList initialZmiany={zmiany} />
      <FormularzZamowieniaList initialZamowienia={zamowienia} />
    </form>
  );
}
