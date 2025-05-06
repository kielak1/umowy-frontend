"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Umowa, ZmianaUmowy, Zamowienie } from "@/app/contracts/grid/types";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export default function UmowaEdycjaPage() {
  const searchParams = useSearchParams();
  const idParam = searchParams.get("id");
  const [umowa, setUmowa] = useState<Umowa | null>(null);
  const [zmiany, setZmiany] = useState<ZmianaUmowy[]>([]);
  const [zamowienia, setZamowienia] = useState<Zamowienie[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUmowa = async () => {
      if (!idParam) {
        setError("Brak ID umowy w adresie URL");
        return;
      }

      try {
        const umowaRes = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_API_URL}/api/umowy/${idParam}/`
        );
        if (!umowaRes.ok) throw new Error("Nie udało się pobrać umowy");

        const umowaData: Umowa = await umowaRes.json();
        setUmowa(umowaData);

        const [zmianyRes, zamowieniaRes] = await Promise.all([
          fetchWithAuth(
            `${process.env.NEXT_PUBLIC_API_URL}/api/zmiany/?umowa_id=${idParam}`
          ),
          fetchWithAuth(
            `${process.env.NEXT_PUBLIC_API_URL}/api/zamowienia/?umowa_id=${idParam}`
          ),
        ]);

        if (!zmianyRes.ok || !zamowieniaRes.ok) {
          throw new Error("Błąd przy pobieraniu powiązanych danych");
        }

        const zmianyData: ZmianaUmowy[] = await zmianyRes.json();
        const zamowieniaData: Zamowienie[] = await zamowieniaRes.json();

        setZmiany(zmianyData);
        setZamowienia(zamowieniaData);
      } catch (err) {
        console.error(err);
        setError("Wystąpił błąd podczas ładowania danych umowy.");
      }
    };

    fetchUmowa();
  }, [idParam]);

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  if (!umowa) {
    return <div>Ładowanie danych umowy...</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">Umowa #{umowa.numer}</h1>
      <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
        {JSON.stringify(umowa, null, 2)}
      </pre>

      <h2 className="text-lg font-medium">Zmiany</h2>
      <pre className="bg-gray-50 p-2 rounded text-sm overflow-auto">
        {JSON.stringify(zmiany, null, 2)}
      </pre>

      <h2 className="text-lg font-medium">Zamówienia</h2>
      <pre className="bg-gray-50 p-2 rounded text-sm overflow-auto">
        {JSON.stringify(zamowienia, null, 2)}
      </pre>
    </div>
  );
}
