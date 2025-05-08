"use client";

import { Umowa, ZmianaUmowy, Zamowienie } from "@/app/contracts/grid/types";
import { useState, useEffect } from "react";
import FormularzZmianyList from "./FormularzZmianyList";
import FormularzZamowieniaList from "./FormularzZamowieniaList";
import { useZmianyForm } from "./useZmianyForm";
import FormularzDaneUmowy, {
  UmowaFormDataFragment,
} from "./FormularzDaneUmowy";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

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
  const [umowaData, setUmowaData] = useState<UmowaFormDataFragment | null>(
    null
  );

  const handleZapiszUmowe = async () => {
    if (!umowaData) return;
    try {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/api/umowy/${umowa.id}/`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(umowaData),
        }
      );
      if (!res.ok) throw new Error("Błąd zapisu umowy");
      alert("Zapisano dane umowy");
    } catch (err) {
      console.error(err);
      alert("Błąd zapisu danych umowy");
    }
  };

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

  const handleZapisz = async () => {
    const ok = await zapiszZmiany();
    if (ok) alert("Zapisano zmiany umowy");
  };

  return (
    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
      <FormularzDaneUmowy umowa={umowa} onChange={setUmowaData} />
      <button
        type="button"
        onClick={handleZapiszUmowe}
        className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Zapisz dane umowy
      </button>

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
