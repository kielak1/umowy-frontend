"use client";

import { useEffect, useState } from "react";
import ZamowieniaGrid from "./ZamowieniaGrid";

interface ZmianaUmowy {
  id: number;
  rodzaj: string;
  data_zawarcia: string;
  kwota_netto: string;
  waluta: string;
}

interface Props {
  data: {
    id: number;
    czy_ramowa: boolean;
  };
}

export default function UmowaDetails({ data }: Props) {
  const [zmiany, setZmiany] = useState<ZmianaUmowy[] | null>(null);

  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/zmiany/?umowa_id=${Math.abs(
        data.id
      )}`
    )
      .then((res) => res.json())
      .then(setZmiany)
      .catch((err) => console.error("Błąd przy pobieraniu zmian:", err));
  }, [data.id]);

  return (
    <div className="p-4 bg-gray-50 border rounded text-sm">
      <h4 className="font-bold mb-2">Zmiany umowy</h4>
      {zmiany === null ? (
        <p>Ładowanie zmian...</p>
      ) : zmiany.length === 0 ? (
        <p>Brak zmian dla tej umowy.</p>
      ) : (
        <table className="w-full border text-left text-sm mb-4">
          <thead className="bg-gray-100">
            <tr>
              <th>Rodzaj</th>
              <th>Data zawarcia</th>
              <th>Kwota netto</th>
              <th>Waluta</th>
            </tr>
          </thead>
          <tbody>
            {zmiany.map((z) => (
              <tr key={z.id}>
                <td>{z.rodzaj}</td>
                <td>{z.data_zawarcia}</td>
                <td>{z.kwota_netto}</td>
                <td>{z.waluta}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {data.czy_ramowa && (
        <div className="mt-4">
          <h4 className="font-bold mb-2">Zamówienia</h4>
          <ZamowieniaGrid umowaId={data.id} />
        </div>
      )}
    </div>
  );
}
