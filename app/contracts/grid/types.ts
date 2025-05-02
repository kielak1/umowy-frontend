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
export interface ZmianaUmowy {
  data_zawarcia: string;
  kwota_netto: string;
  waluta: string;
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
  _expanded?: boolean | "inline";
}

export interface Zamowienie {
    id: number;
    numer_zamowienia: string;
    data_zlozenia: string;
    data_realizacji: string | null;
    kwota_netto: string;
    waluta: string;
    opis: string;
  }
  