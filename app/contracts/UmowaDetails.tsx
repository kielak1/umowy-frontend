"use client";

import { useEffect, useState } from "react";

interface ZmianaUmowy {
  id: number;
  rodzaj: string;
  data_zawarcia: string;
  kwota_netto: string;
  waluta: string;
}

interface Zamowienie {
  id: number;
  numer_zamowienia: string;
  data_zlozenia: string;
  kwota_netto: string;
  waluta: string;
}

interface Props {
  data: { id: number; czy_ramowa: boolean };
}

export default function UmowaDetails({ data }: Props) {
  const [zmiany, setZmiany] = useState<ZmianaUmowy[]>([]);
  const [zamowienia, setZamowienia] = useState<Zamowienie[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/zmiany/?umowa_id=${data.id}`)
      .then((res) => res.json())
      .then(setZmiany)
      .catch((err) => console.error("Błąd przy pobieraniu zmian:", err));

    if (data.czy_ramowa) {
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/zamowienia/?umowa_id=${data.id}`
      )
        .then((res) => res.json())
        .then(setZamowienia)
        .catch((err) => console.error("Błąd przy pobieraniu zamówień:", err));
    }
  }, [data.id, data.czy_ramowa]);

  return (
    <div className="p-2">
      <div>
        <h4 className="font-bold mb-1">Zmiany umowy</h4>
        <table className="w-full text-sm border">
          <thead className="bg-gray-200 text-left">
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
      </div>

      {data.czy_ramowa && (
        <div className="mt-4">
          <h4 className="font-bold mb-1">Zamówienia</h4>
          <table className="w-full text-sm border">
            <thead className="bg-gray-200 text-left">
              <tr>
                <th>Numer</th>
                <th>Data złożenia</th>
                <th>Kwota netto</th>
                <th>Waluta</th>
              </tr>
            </thead>
            <tbody>
              {zamowienia.map((z) => (
                <tr key={z.id}>
                  <td>{z.numer_zamowienia}</td>
                  <td>{z.data_zlozenia}</td>
                  <td>{z.kwota_netto}</td>
                  <td>{z.waluta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
