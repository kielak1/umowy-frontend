// app/contracts/standard/FormularzDaneUmowy.tsx
"use client";

import { Umowa } from "@/app/contracts/grid/types";
import { useState, useEffect } from "react";

type Props = {
  umowa: Umowa;
  onChange: (dane: UmowaFormDataFragment) => void;
};

export type UmowaFormDataFragment = {
  numer: string;
  czy_ramowa: boolean;
  czy_dotyczy_konkretnych_uslug: boolean;
  czy_spelnia_dora: boolean;
  czy_wymaga_kontynuacji: boolean;
  wymagana_data_kontynuacji: string | null;
  kontrahent_id?: number;
  opiekun_id?: number;
  jednostka_organizacyjna_id?: number;
};

export default function FormularzDaneUmowy({ umowa, onChange }: Props) {
  const [formData, setFormData] = useState<UmowaFormDataFragment>({
    numer: umowa.numer,
    czy_ramowa: umowa.czy_ramowa,
    czy_dotyczy_konkretnych_uslug: umowa.czy_dotyczy_konkretnych_uslug,
    czy_spelnia_dora: umowa.czy_spelnia_dora,
    czy_wymaga_kontynuacji: umowa.czy_wymaga_kontynuacji,
    wymagana_data_kontynuacji: umowa.wymagana_data_kontynuacji ?? "",
    kontrahent_id: umowa.kontrahent?.id,
    opiekun_id: umowa.opiekun?.id,
    jednostka_organizacyjna_id: umowa.jednostka_organizacyjna?.id,
  });

  useEffect(() => {
    onChange(formData);
  }, [formData , onChange]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, type, value } = e.target;
    const newValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(newValue) : newValue,
    }));
  };

  return (
    <fieldset className="space-y-4 border p-4 rounded">
      <legend className="font-semibold text-lg">Dane umowy</legend>

      <input
        type="text"
        name="numer"
        value={formData.numer}
        onChange={handleChange}
        className="border rounded px-2 py-1 w-full"
        placeholder="Numer CRB"
      />

      <div className="flex flex-wrap gap-4">
        {[
          ["czy_ramowa", "Ramowa"],
          ["czy_dotyczy_konkretnych_uslug", "Dotyczy konkretnych usług"],
          ["czy_spelnia_dora", "Spełnia DORA"],
          ["czy_wymaga_kontynuacji", "Wymaga kontynuacji"],
        ].map(([name, label]) => (
          <label key={name} className="flex items-center gap-2">
            <input
              type="checkbox"
              name={name}
              checked={formData[name as keyof typeof formData] as boolean}
              onChange={handleChange}
            />
            {label}
          </label>
        ))}
      </div>

      <div>
        <label className="block">Data kontynuacji</label>
        <input
          type="date"
          name="wymagana_data_kontynuacji"
          value={formData.wymagana_data_kontynuacji ?? ""}
          onChange={handleChange}
          className="border rounded px-2 py-1"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="number"
          name="kontrahent_id"
          value={formData.kontrahent_id ?? ""}
          onChange={handleChange}
          className="border rounded px-2 py-1"
          placeholder="ID kontrahenta"
        />
        <input
          type="number"
          name="opiekun_id"
          value={formData.opiekun_id ?? ""}
          onChange={handleChange}
          className="border rounded px-2 py-1"
          placeholder="ID opiekuna"
        />
        <input
          type="number"
          name="jednostka_organizacyjna_id"
          value={formData.jednostka_organizacyjna_id ?? ""}
          onChange={handleChange}
          className="border rounded px-2 py-1"
          placeholder="ID jednostki"
        />
      </div>
    </fieldset>
  );
}
