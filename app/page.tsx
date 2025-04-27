"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Kontrahent {
  id: number;
  nazwa_kontrahenta: string;
}

interface Umowa {
  id: number;
  numer: string;
  przedmiot: string;
  data_zawarcia: string;
  czy_wymaga_kontynuacji: boolean;
  wymagana_data_zawarcia_kolejnej_umowy: string | null;
  czy_spelnia_wymagania_dora: boolean;
  kontrahent: Kontrahent | null;
}

export default function Home() {
  const [rowData, setRowData] = useState<Umowa[]>([]);

  useEffect(() => {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/umowy/`;

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Błąd podczas pobierania danych");
        }
        return response.json();
      })
      .then((data) => setRowData(data))
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Lista umów</h1>
        <Link href="/nowa-umowa">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Dodaj nową umowę
          </button>
        </Link>
      </div>

      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="border px-4 py-2">Numer</th>
            <th className="border px-4 py-2">Przedmiot</th>
            <th className="border px-4 py-2">Data zawarcia</th>
            <th className="border px-4 py-2">Kontrahent</th>
          </tr>
        </thead>
        <tbody>
          {rowData.map((umowa) => (
            <tr key={umowa.id}>
              <td className="border px-4 py-2">{umowa.numer}</td>
              <td className="border px-4 py-2">{umowa.przedmiot}</td>
              <td className="border px-4 py-2">{umowa.data_zawarcia}</td>
              <td className="border px-4 py-2">
                {umowa.kontrahent ? umowa.kontrahent.nazwa_kontrahenta : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
