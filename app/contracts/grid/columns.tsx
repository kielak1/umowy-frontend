import { ColDef, ICellRendererParams } from "ag-grid-community";
import { Umowa } from "./types";

export const buildColDefs = (
  setRowData: React.Dispatch<React.SetStateAction<Umowa[]>>
): ColDef<Umowa>[] => [
  {
    headerName: "",
    width: 80,
    cellRenderer: (params: ICellRendererParams) => {
      if (typeof params.data._expanded === "string") return "";

      return (
        <button
          className="text-blue-600 underline text-sm"
          onClick={() => {
            const id = params.data.id;
            const isExpanded = !!params.data._expanded;

            setRowData((prev) => {
              const updated: Umowa[] = [];

              for (const row of prev) {
                // usuń rozwinięcie (np. -27)
                if (row.id === -id && isExpanded) {
                  continue;
                }

                if (row.id === id) {
                  const now = { ...row, _expanded: !isExpanded };
                  updated.push(now);
                  if (!isExpanded) {
                    updated.push({ ...row, id: -row.id, _expanded: "inline" });
                  }
                } else {
                  updated.push(row);
                }
              }

              return updated;
            });
          }}
        >
          {params.data._expanded ? "Ukryj" : "Szczegóły"}
        </button>
      );
    },
  },
  { headerName: "Numer", field: "numer", editable: true },
  { headerName: "Czy ramowa", field: "czy_ramowa", editable: true },
  {
    headerName: "Czy dot. usługi",
    field: "czy_dotyczy_konkretnych_uslug",
    editable: true,
  },
  { headerName: "Czy spełnia DORA", field: "czy_spelnia_dora", editable: true },
  {
    headerName: "Wymaga kontynuacji",
    field: "czy_wymaga_kontynuacji",
    editable: true,
  },
  {
    headerName: "Data kolejnej",
    field: "wymagana_data_kontynuacji",
    editable: true,
  },
  { headerName: "Data zawarcia", field: "najnowsza_zmiana.data_zawarcia" },
  { headerName: "Kwota", field: "najnowsza_zmiana.kwota_netto" },
  { headerName: "Waluta", field: "najnowsza_zmiana.waluta" },
  { headerName: "Kontrahent", field: "kontrahent.nazwa" },
  { headerName: "Opiekun", field: "opiekun.username" },
  { headerName: "Jednostka", field: "jednostka_organizacyjna.name" },
];
