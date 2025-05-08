// types/global.d.ts
export {};

declare global {
  interface Window {
    __validateUmowaForm?: () => boolean;
  }
}

export interface Kontrahent {
  id: number;
  nazwa: string;
}
export interface User {
  id: number;
  username: string;
}
export interface OrganizationalUnit {
  id: number;
  name: string;
}

// Słowniki
export interface SlownikKategoriaUmowy {
  id: number;
  nazwa: string;
}

export interface SlownikObszarFunkcjonalny {
  id: number;
  nazwa: string;
}

export interface SlownikWlasciciel {
  id: number;
  nazwa: string;
}

export interface SlownikStatusUmowy {
  id: number;
  nazwa: string;
}

export interface SlownikKlasyfikacjaUmowy {
  id: number;
  nazwa: string;
}

export interface ZmianaUmowy {
  id: number;
  rodzaj: "umowa" | "aneks" | "porozumienie" | "inne";
  data_zawarcia: string;
  data_obowiazywania_od: string;
  data_obowiazywania_do: string | null;
  data_podpisania: string | null;
  data_wypowiedzenia: string | null;
  trzeba_wypowiedziec: boolean;
  finansowanie_do: string | null;

  przedmiot: string | null;
  producenci: string | null;
  numer_umowy_dostawcy: string | null;
  kwota_netto: string | null;
  waluta: "PLN" | "EUR" | "USD";
  opis: string;

  kategoria: SlownikKategoriaUmowy | null;
  obszary_funkcjonalne: SlownikObszarFunkcjonalny[];
  wlasciciel: SlownikWlasciciel | null;
  status: SlownikStatusUmowy | null;
  klasyfikacja: SlownikKlasyfikacjaUmowy | null;
}

export interface Umowa {
  id: number;
  numer: string;
  czy_ramowa: boolean;
  czy_dotyczy_konkretnych_uslug: boolean;
  czy_spelnia_dora: boolean;
  czy_wymaga_kontynuacji: boolean;
  wymagana_data_kontynuacji: string | null;

  kontrahent: Kontrahent | null;
  opiekun: User | null;
  jednostka_organizacyjna: OrganizationalUnit | null;

  najnowsza_zmiana: ZmianaUmowy | null;
  zamowienia?: Zamowienie[];
  zmiany?: ZmianaUmowy[];

  _expanded?: boolean | "inline";
}

export interface Zamowienie {
  id: number;
  numer_zamowienia: string;
  data_zlozenia: string;
  data_realizacji: string | null;
  kwota_netto: string;
  waluta: "PLN" | "EUR" | "USD";
  opis: string;

  przedmiot: string | null;
  producenci: string | null;
}

export interface UmowaFormData {
  numer: string;
  kontrahent_id?: number;
  opiekun_id?: number;
  jednostka_organizacyjna_id?: number;

  czy_ramowa: boolean;
  czy_dotyczy_konkretnych_uslug: boolean;
  czy_spelnia_dora: boolean;
  czy_wymaga_kontynuacji: boolean;
  wymagana_data_kontynuacji?: string | null;

  zmiany: Partial<ZmianaUmowy & { id?: number }>[];
  zamowienia: Partial<Zamowienie & { id?: number }>[];
}

export type ZmianaUmowaDoForm = {
  id?: number;
  rodzaj: string;
  data_zawarcia: string | null;
  data_obowiazywania_od: string | null;
  data_obowiazywania_do: string | null;
  kwota_netto: string | null;
  waluta: "PLN" | "EUR" | "USD";
  opis: string | null;

  przedmiot: string | null;
  producenci: string | null;
  numer_umowy_dostawcy: string | null;

  kategoria_id?: number | null;
  wlasciciel_id?: number | null;
  status_id?: number | null;
  klasyfikacja_id?: number | null;
  obszary_funkcjonalne_ids?: number[] | null;

  data_podpisania: string | null;
  data_wypowiedzenia: string | null;
  trzeba_wypowiedziec: boolean;
  finansowanie_do: string | null;

  umowa: number;
};
