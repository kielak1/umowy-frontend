"use client";

import {
  Umowa,
  ZmianaUmowy,
  Zamowienie,
  UmowaFormData,
} from "@/app/contracts/grid/types";
import FormularzZmianyList from "./FormularzZmianyList";
import FormularzZamowieniaList from "./FormularzZamowieniaList";
import { useUmowaForm } from "./useUmowaForm";

type Props = {
  umowa: Umowa;
  zmiany: ZmianaUmowa[];
  zamowienia: Zamowienie[];
};

export default function FormularzPelnejUmowy({
  umowa,
  zmiany,
  zamowienia,
}: Props) {
  const {
    formData,
    handleChange,
    submit,
    isSubmitting,
    submitError,
    successMessage,
  } = useUmowaForm({
    numer: umowa.numer,
    czy_ramowa: umowa.czy_ramowa,
    czy_dotyczy_konkretnych_uslug: umowa.czy_dotyczy_konkretnych_uslug,
    czy_spelnia_dora: umowa.czy_spelnia_dora,
    czy_wymaga_kontynuacji: umowa.czy_wymaga_kontynuacji,
    wymagana_data_kontynuacji: umowa.wymagana_data_kontynuacji,
    kontrahent_id: umowa.kontrahent?.id,
    opiekun_id: umowa.opiekun?.id,
    jednostka_organizacyjna_id: umowa.jednostka_organizacyjna?.id,
    zmiany: [],
    zamowienia: [],
  });

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        submit(umowa.id);
      }}
    >
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

      {submitError && <p className="text-red-600">{submitError}</p>}
      {successMessage && <p className="text-green-600">{successMessage}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {isSubmitting ? "Zapisywanie..." : "Zapisz podstawowe dane umowy"}
      </button>

      <FormularzZmianyList initialZmiany={zmiany} />
      <FormularzZamowieniaList initialZamowienia={zamowienia} />
    </form>
  );
}
