"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Kontrahent {
  id: number;
  nazwa_kontrahenta: string;
}

export default function NowaUmowa() {
  const router = useRouter();
  const [numer, setNumer] = useState("");
  const [przedmiot, setPrzedmiot] = useState("");
  const [dataZawarcia, setDataZawarcia] = useState("");
  const [czyWymagaKontynuacji, setCzyWymagaKontynuacji] = useState(false);
  const [wymaganaDataNowejUmowy, setWymaganaDataNowejUmowy] = useState("");
  const [czySpelniaDora, setCzySpelniaDora] = useState(false);
  const [kontrahenci, setKontrahenci] = useState<Kontrahent[]>([]);
  const [wybranyKontrahent, setWybranyKontrahent] = useState<number | null>(
    null
  );

  useEffect(() => {
    const kontrahenciUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/kontrahenci/`;

    fetch(kontrahenciUrl)
      .then((response) => response.json())
      .then((data) => setKontrahenci(data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wybranyKontrahent) {
      alert("Wybierz kontrahenta");
      return;
    }

    const nowaUmowa = {
      numer,
      przedmiot,
      data_zawarcia: dataZawarcia,
      czy_wymaga_kontynuacji: czyWymagaKontynuacji,
      wymagana_data_zawarcia_kolejnej_umowy: wymaganaDataNowejUmowy || null,
      czy_spelnia_wymagania_dora: czySpelniaDora,
      kontrahent_id: wybranyKontrahent,
    };

    const umowyUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/umowy/`;

    await fetch(umowyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nowaUmowa),
    });

    router.push("/");
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
          placeholder="Przedmiot umowy"
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
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={czyWymagaKontynuacji}
            onChange={(e) => setCzyWymagaKontynuacji(e.target.checked)}
            className="mr-2"
          />
          <label>Czy wymaga kontynuacji?</label>
        </div>
        <input
          type="date"
          placeholder="Wymagana data nowej umowy"
          value={wymaganaDataNowejUmowy}
          onChange={(e) => setWymaganaDataNowejUmowy(e.target.value)}
          className="border p-2 w-full"
        />
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={czySpelniaDora}
            onChange={(e) => setCzySpelniaDora(e.target.checked)}
            className="mr-2"
          />
          <label>Czy spełnia wymagania DORA?</label>
        </div>
        <select
          value={wybranyKontrahent || ""}
          onChange={(e) => setWybranyKontrahent(Number(e.target.value))}
          className="border p-2 w-full"
          required
        >
          <option value="" disabled>
            Wybierz kontrahenta
          </option>
          {kontrahenci.map((k) => (
            <option key={k.id} value={k.id}>
              {k.nazwa_kontrahenta}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Dodaj umowę
        </button>
      </form>
    </div>
  );
}
