"use client";

import { useState, useEffect } from "react";
import {
  Umowa,
  ZmianaUmowy,
  Zamowienie,
  SlownikKategoriaUmowy,
  SlownikWlasciciel,
  SlownikStatusUmowy,
  SlownikKlasyfikacjaUmowy,
  SlownikObszarFunkcjonalny,
} from "@/app/contracts/grid/types";
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

  const [kategorie, setKategorie] = useState<SlownikKategoriaUmowy[]>([]);
  const [wlasciciele, setWlasciciele] = useState<SlownikWlasciciel[]>([]);
  const [statusy, setStatusy] = useState<SlownikStatusUmowy[]>([]);
  const [klasyfikacje, setKlasyfikacje] = useState<SlownikKlasyfikacjaUmowy[]>(
    []
  );
  const [obszary, setObszary] = useState<SlownikObszarFunkcjonalny[]>([]);

  useEffect(() => {
    const fetchSlowniki = async () => {
      try {
        const [katRes, wlascRes, statRes, klasRes, obszRes] = await Promise.all(
          [
            fetchWithAuth(
              `${process.env.NEXT_PUBLIC_API_URL}/api/slownikkategoriaumowy/`
            ),
            fetchWithAuth(
              `${process.env.NEXT_PUBLIC_API_URL}/api/slownikwlasciciel/`
            ),
            fetchWithAuth(
              `${process.env.NEXT_PUBLIC_API_URL}/api/slownikstatusumowy/`
            ),
            fetchWithAuth(
              `${process.env.NEXT_PUBLIC_API_URL}/api/slownikklasyfikacjaumowy/`
            ),
            fetchWithAuth(
              `${process.env.NEXT_PUBLIC_API_URL}/api/slownikobszarfunkcjonalny/`
            ),
          ]
        );
        setKategorie(await katRes.json());
        setWlasciciele(await wlascRes.json());
        setStatusy(await statRes.json());
        setKlasyfikacje(await klasRes.json());
        setObszary(await obszRes.json());
      } catch (err) {
        console.error("❌ Błąd ładowania słowników", err);
      }
    };

    fetchSlowniki();
  }, []);

  const handleZapiszUmowe = async () => {
    if (!umowaData) return;
    const payload = {
      ...umowaData,
      wymagana_data_kontynuacji:
        umowaData.wymagana_data_kontynuacji?.trim() === ""
          ? null
          : umowaData.wymagana_data_kontynuacji,
    };
    try {
      if (!window.__validateUmowaForm?.()) return;

      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/api/umowy/${umowa.id}/`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
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
    loading: loadingZmiany,
    error: errorZmiany,
  } = useZmianyForm(zmiany, umowa.id);

  useEffect(() => {
    console.log("Zawartość zmian:", zmianyForm);
    console.log("Zawartość zamówień:", zamowienia);
  }, [zmianyForm, zamowienia]);

  const handleZapiszZmiany = async () => {
    console.log("▶️ Uruchomiono handleZapiszZmiany");
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
        kategorie={kategorie}
        wlasciciele={wlasciciele}
        statusy={statusy}
        klasyfikacje={klasyfikacje}
        obszary={obszary}
      />

      {errorZmiany && <div className="text-red-600">{errorZmiany}</div>}
      <button
        type="button"
        onClick={handleZapiszZmiany}
        disabled={loadingZmiany}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {loadingZmiany ? "Zapisywanie..." : "Zapisz zmiany"}
      </button>

      <FormularzZamowieniaList zamowienia={zamowienia} umowaId={umowa.id} />
    </form>
  );
}
