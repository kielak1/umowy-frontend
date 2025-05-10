"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { useZamowieniaForm } from "./useZamowieniaForm";

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
  const router = useRouter();

  const {
    zmiany: zmianyForm,
    handleZmianaChange,
    handleZmianaDelete,
    handleZmianaAdd,
    zapiszZmiany,
    error: errorZmiany,
  } = useZmianyForm(zmiany, umowa.id);

  const {
    zamowienia: zamowieniaForm,
    handleZamowienieAdd,
    handleZamowienieChange,
    handleZamowienieDelete,
    zapiszZamowienia,
    loading: loadingZamowienia,
    error: errorZamowienia,
  } = useZamowieniaForm(zamowienia, umowa.id);

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

  const handleUsunUmowe = async () => {
    const potwierdzenie = confirm("Czy na pewno chcesz usunąć tę umowę?");
    if (!potwierdzenie) return;

    try {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/api/umowy/${umowa.id}/`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error("Błąd usuwania umowy");

      alert("Umowa została usunięta.");
      router.push("/contracts");
    } catch (err) {
      console.error(err);
      alert("Błąd podczas usuwania umowy");
    }
  };

  const handleZapisz = async () => {
    if (!umowaData) return;
    if (!window.__validateUmowaForm?.()) return;

    const payload = {
      ...umowaData,
      wymagana_data_kontynuacji:
        umowaData.wymagana_data_kontynuacji?.trim() === ""
          ? null
          : umowaData.wymagana_data_kontynuacji,
    };

    try {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/api/umowy/${umowa.id}/`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Błąd zapisu umowy");

      const okZmiany = await zapiszZmiany();
      if (!okZmiany) throw new Error("Błąd zapisu zmian");

      const okZamowienia = await zapiszZamowienia();
      if (!okZamowienia) throw new Error("Błąd zapisu zamówień");

      alert("Zapisano wszystkie dane");
    } catch (err) {
      console.error(err);
      alert("Błąd podczas zapisu. Szczegóły w konsoli.");
    }
  };

  return (
    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
      <FormularzDaneUmowy umowa={umowa} onChange={setUmowaData} />

      <div className="mt-2 flex gap-4 flex-wrap">
        <button
          type="button"
          onClick={handleZapisz}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-900"
        >
          💾 Zapisz wszystko
        </button>
        <button
          type="button"
          onClick={handleUsunUmowe}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Usuń wszystko
        </button>
      </div>

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

      <FormularzZamowieniaList
        zamowienia={zamowieniaForm}
        onChange={handleZamowienieChange}
        onDelete={handleZamowienieDelete}
        onAdd={handleZamowienieAdd}
        loading={loadingZamowienia}
        error={errorZamowienia}
      />
    </form>
  );
}
