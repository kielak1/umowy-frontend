import type { ColDef } from "ag-grid-community";
import { ZmianaUmowy } from "./types";

export const columnsZmiany: ColDef<ZmianaUmowy>[] = [
  { headerName: "Rodzaj", field: "rodzaj", editable: true },
  { headerName: "Data zawarcia", field: "data_zawarcia", editable: true },
  { headerName: "Kwota netto", field: "kwota_netto", editable: true },
  { headerName: "Waluta", field: "waluta", editable: true },
];
