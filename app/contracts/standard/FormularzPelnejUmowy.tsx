"use client";

import { Umowa, ZmianaUmowy, Zamowienie } from "@/app/contracts/grid/types";
import { useState, useEffect } from "react";
import FormularzZmianyList from "./FormularzZmianyList";
import FormularzZamowieniaList from "./FormularzZamowieniaList";
import { useZmianyForm } from "./useZmianyForm";

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
    numer: umowa.numer,
    czy_ramowa: umowa.czy_ramowa,
    czy_dotyczy_konkretnych_uslug: umowa.czy_dotyczy_konkretnych_uslug,
    czy_spelnia_dora: umowa.czy_spelnia_dora,
    czy_wymaga_kontynuacji: umowa.czy_wymaga_kontynuacji,
    wymagana_data_kontynuacji: umowa.wymagana_data_kontynuacji ?? "",
  });

  const {
    zmiany: zmianyForm,
    handleZmianaChange,
    handleZmianaDelete,
    handleZmianaAdd,
    zapiszZmiany,
    loading,
    error,
  } = useZmianyForm(zmiany, umowa.id);

  // Logowanie zawartości zmian i zamówień do konsoli
  useEffect(() => {
    console.log("Zawartość zmian:", zmianyForm);
    console.log("Zawartość zamówień:", zamowienia);
  }, [zmianyForm, zamowienia]);

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

  const handleZapisz = async () => {
    const ok = await zapiszZmiany();
    if (ok) alert("Zapisano zmiany umowy");
  };

  return (
    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
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

      <div className="flex gap-4 flex-wrap">
        {[
          { name: "czy_ramowa", label: "Ramowa" },
          {
            name: "czy_dotyczy_konkretnych_uslug",
            label: "Dotyczy konkretnych usług",
          },
          { name: "czy_spelnia_dora", label: "Spełnia DORA" },
          { name: "czy_wymaga_kontynuacji", label: "Wymaga kontynuacji" },
        ].map(({ name, label }) => (
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
        <label className="block font-medium">Data kontynuacji</label>
        <input
          type="date"
          name="wymagana_data_kontynuacji"
          value={formData.wymagana_data_kontynuacji}
          onChange={handleChange}
          className="border rounded px-2 py-1"
        />
      </div>

      <FormularzZmianyList
        zmiany={zmianyForm}
        onChange={handleZmianaChange}
        onDelete={handleZmianaDelete}
        onAdd={handleZmianaAdd}
      />

      <FormularzZamowieniaList initialZamowienia={zamowienia} />

      {error && <div className="text-red-600">{error}</div>}

      <button
        type="button"
        onClick={handleZapisz}
        disabled={loading}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {loading ? "Zapisywanie..." : "Zapisz zmiany"}
      </button>
    </form>
  );
}
