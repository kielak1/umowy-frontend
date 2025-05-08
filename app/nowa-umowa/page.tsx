"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

interface Kontrahent {
  id: number;
  nazwa: string;
}

export default function NowaUmowa() {
  const router = useRouter();

  const [numer, setNumer] = useState("");
  const [przedmiot, setPrzedmiot] = useState("");
  const [dataZawarcia, setDataZawarcia] = useState("");
  const [kwotaNetto, setKwotaNetto] = useState("");

  const [kontrahenci, setKontrahenci] = useState<Kontrahent[]>([]);
  const [kontrahentId, setKontrahentId] = useState<number | null>(null);

  useEffect(() => {
    const fetchKontrahenci = async () => {
      try {
        const res = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_API_URL}/api/kontrahenci/`
        );
        if (!res.ok) throw new Error("Błąd pobierania kontrahentów");
        const data = await res.json();
        setKontrahenci(data);
      } catch (err) {
        console.error("❌ Błąd:", err);
      }
    };
    fetchKontrahenci();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !numer.trim() ||
      !przedmiot.trim() ||
      !dataZawarcia ||
      !kwotaNetto ||
      !kontrahentId
    ) {
      alert("Wszystkie pola są wymagane.");
      return;
    }

    try {
      // 1. Utwórz umowę
      const umowaRes = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/api/umowy/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            numer,
            kontrahent_id: kontrahentId,
          }),
        }
      );

      if (!umowaRes.ok) throw new Error("Nie udało się utworzyć umowy");

      const umowa = await umowaRes.json();

      // 2. Utwórz zmianę powiązaną z umową
      const zmianaPayload = {
        umowa: umowa.id,
        rodzaj: "umowa",
        przedmiot,
        data_zawarcia: dataZawarcia,
        data_obowiazywania_od: dataZawarcia,
        data_obowiazywania_do: null,
        kwota_netto: kwotaNetto,
        waluta: "PLN",
        opis: "",
        trzeba_wypowiedziec: false,
        finansowanie_do: null,
        producenci: null,
        numer_umowy_dostawcy: null,
        kategoria_id: null,
        wlasciciel_id: null,
        status_id: null,
        klasyfikacja_id: null,
        obszary_funkcjonalne_ids: [],
        data_podpisania: null,
        data_wypowiedzenia: null,
      };

      const zmianaRes = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/api/zmiany/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(zmianaPayload),
        }
      );

      if (!zmianaRes.ok) throw new Error("Nie udało się utworzyć zmiany");

      // 3. Przekierowanie
      router.push(`/contracts/standard?id=${umowa.id}`);
    } catch (err) {
      console.error(err);
      alert("Wystąpił błąd podczas zapisu.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dodaj nową umowę</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Numer umowy"
          value={numer}
          onChange={(e) => setNumer(e.target.value)}
          className="border p-2 w-full"
          required
        />

        <textarea
          placeholder="Przedmiot zmiany"
          value={przedmiot}
          onChange={(e) => setPrzedmiot(e.target.value)}
          className="border p-2 w-full"
          required
        />

        <input
          type="date"
          placeholder="Data zawarcia"
          value={dataZawarcia}
          onChange={(e) => setDataZawarcia(e.target.value)}
          className="border p-2 w-full"
          required
        />

        <input
          type="number"
          placeholder="Kwota netto"
          value={kwotaNetto}
          onChange={(e) => setKwotaNetto(e.target.value)}
          className="border p-2 w-full"
          required
        />

        <select
          value={kontrahentId ?? ""}
          onChange={(e) => setKontrahentId(Number(e.target.value))}
          className="border p-2 w-full"
          required
        >
          <option value="">-- Wybierz kontrahenta --</option>
          {kontrahenci.map((k) => (
            <option key={k.id} value={k.id}>
              {k.nazwa}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Dodaj umowę
        </button>
      </form>
    </div>
  );
}
