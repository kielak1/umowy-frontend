"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export function useSlownik<T>(endpoint: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_API_URL}/api/${endpoint}/`
        );
        if (!res.ok) throw new Error(`Błąd pobierania danych z ${endpoint}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err : new Error("Nieznany błąd"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  return { data, loading, error };
}
