import { ZmianaUmowaDoForm } from "@/app/contracts/grid/types";

type ZmianaDoZapisu = {
  id?: number;
  rodzaj: string;
  data_zawarcia: string;
  data_obowiazywania_od: string;
  data_obowiazywania_do: string | null;
  kwota_netto: string;
  waluta: "PLN" | "EUR" | "USD";
  opis: string;

  przedmiot: string | null;
  producenci: string | null;
  numer_umowy_dostawcy: string | null;

  kategoria_id?: number | null;
  wlasciciel_id?: number | null;
  status_id?: number | null;
  klasyfikacja_id?: number | null;
  obszary_funkcjonalne_ids?: number[];

  data_podpisania: string | null;
  data_wypowiedzenia: string | null;
  trzeba_wypowiedziec: boolean;
  finansowanie_do: string | null;

  umowa: number;
};

export function serializeZmianyDoZapisania(
  zmiany: ZmianaUmowaDoForm[]
): ZmianaDoZapisu[] {
  return zmiany.map((z) => {
    const oczyszczoneObszary = (z.obszary_funkcjonalne_ids ?? []).filter(
      (id): id is number => id !== null && id !== undefined
    );

    const zmiana: ZmianaDoZapisu = {
      id: z.id && z.id > 0 ? z.id : undefined,
      rodzaj: z.rodzaj,
      data_zawarcia: z.data_zawarcia!,
      data_obowiazywania_od: z.data_obowiazywania_od!,
      data_obowiazywania_do: z.data_obowiazywania_do,
      kwota_netto: z.kwota_netto!,
      waluta: z.waluta,
      opis: z.opis ?? "",
      przedmiot: z.przedmiot,
      producenci: z.producenci,
      numer_umowy_dostawcy: z.numer_umowy_dostawcy,

      kategoria_id: z.kategoria_id ?? null,
      wlasciciel_id: z.wlasciciel_id ?? null,
      status_id: z.status_id ?? null,
      klasyfikacja_id: z.klasyfikacja_id ?? null,

      data_podpisania: z.data_podpisania,
      data_wypowiedzenia: z.data_wypowiedzenia,
      trzeba_wypowiedziec: z.trzeba_wypowiedziec,
      finansowanie_do: z.finansowanie_do,
      umowa: z.umowa,
    };

    // tylko jeśli istnieją jakiekolwiek ID – dodaj pole
    if (oczyszczoneObszary.length > 0) {
      zmiana.obszary_funkcjonalne_ids = oczyszczoneObszary;
    }

    return zmiana;
  });
}
