import type { ColDef } from "ag-grid-community";
import type { Zamowienie } from "./types";

export const columnsZamowienia: ColDef<Zamowienie>[] = [
  {
    headerName: "Numer zamówienia",
    field: "numer_zamowienia",
    editable: true,
  },
  {
    headerName: "Data złożenia",
    field: "data_zlozenia",
    editable: true,
  },
  {
    headerName: "Kwota netto",
    field: "kwota_netto",
    editable: true,
  },
  {
    headerName: "Waluta",
    field: "waluta",
    editable: true,
  },
];
