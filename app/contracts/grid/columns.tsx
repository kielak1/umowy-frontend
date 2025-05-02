import type { ColDef, ICellRendererParams } from "ag-grid-community";
import { Umowa } from "./types";
import UmowaDetails from "../UmowaDetails";

// Rozszerzony typ z opcjonalnym polem _expanded
interface UmowaWithExpanded extends Umowa {
  _expanded?: boolean | "inline";
}

type BuildColDefsParams = {
  setRowData: React.Dispatch<React.SetStateAction<UmowaWithExpanded[]>>;
};

export const buildColDefs = ({
  setRowData,
}: BuildColDefsParams): ColDef<UmowaWithExpanded>[] => [
  {
    headerName: "",
    width: 80,
    cellRenderer: ({ data }: ICellRendererParams<UmowaWithExpanded>) => {
      // Bezpiecznik: brak danych lub to jest wiersz _inline => nie pokazuj przycisku
      if (!data || data._expanded === "inline") return null;

      const { id, _expanded } = data;
      const isExpanded = !!_expanded;

      return (
        <button
          className="text-sm text-blue-600 underline hover:text-blue-800"
          onClick={() => {
            setRowData((prev) => {
              const updated: UmowaWithExpanded[] = [];

              for (const row of prev) {
                // zwijamy inne otwarte
                if (row._expanded === "inline") continue;

                if (row.id === id) {
                  const now = { ...row, _expanded: !isExpanded };
                  updated.push(now);

                  if (!isExpanded) {
                    updated.push({
                      ...row,
                      id: -id,
                      _expanded: "inline",
                    });
                  }
                } else {
                  updated.push({ ...row, _expanded: false });
                }
              }

              return updated;
            });
          }}
        >
          {isExpanded ? "Ukryj" : "Szczegóły"}
        </button>
      );
    },
  },
  {
    headerName: "Szczegóły",
    field: "id",
    colSpan: ({ data }) => (data?._expanded === "inline" ? 14 : 1),
    autoHeight: true,
    cellRenderer: ({ data }: ICellRendererParams<UmowaWithExpanded>) => {
      if (data?._expanded !== "inline") return null;
      return <UmowaDetails data={{ ...data, id: Math.abs(data.id) }} />;
    },
    cellStyle: { padding: 0, backgroundColor: "#f8fafc" },
  },
  {
    headerName: "Numer",
    field: "numer",
    filter: "agTextColumnFilter",
    editable: true,
  },
  {
    headerName: "Ramowa",
    field: "czy_ramowa",
    filter: "agSetColumnFilter",
    editable: true,
  },
  {
    headerName: "Dot. usługi",
    field: "czy_dotyczy_konkretnych_uslug",
    filter: "agSetColumnFilter",
    editable: true,
  },
  {
    headerName: "Spełnia DORA",
    field: "czy_spelnia_dora",
    filter: "agSetColumnFilter",
    editable: true,
  },
  {
    headerName: "Wymaga kontynuacji",
    field: "czy_wymaga_kontynuacji",
    filter: "agSetColumnFilter",
    editable: true,
  },
  {
    headerName: "Data kontynuacji",
    field: "wymagana_data_kontynuacji",
    filter: "agDateColumnFilter",
    editable: true,
  },
  {
    headerName: "Data zawarcia",
    field: "najnowsza_zmiana.data_zawarcia",
    filter: "agDateColumnFilter",
  },
  {
    headerName: "Kwota netto",
    field: "najnowsza_zmiana.kwota_netto",
    filter: "agNumberColumnFilter",
  },
  {
    headerName: "Waluta",
    field: "najnowsza_zmiana.waluta",
    filter: "agSetColumnFilter",
  },
  {
    headerName: "Kontrahent",
    field: "kontrahent.nazwa",
    filter: "agTextColumnFilter",
  },
  {
    headerName: "Opiekun",
    field: "opiekun.username",
    filter: "agTextColumnFilter",
  },
  {
    headerName: "Jednostka",
    field: "jednostka_organizacyjna.name",
    filter: "agTextColumnFilter",
  },
];
