"use client";

import type {
  ColDef,
  ICellRendererParams,
  CellClassParams,
} from "ag-grid-community";
import { Umowa } from "./types";
import UmowaDetails from "../UmowaDetails";
import { ChevronRight, ChevronDown } from "lucide-react";
import { Pencil } from "lucide-react";
import Link from "next/link";
import type { SlownikStatusUmowy } from "./types";

interface UmowaWithExpanded extends Umowa {
  _expanded?: boolean | "inline";
}

const getSzczegolyCellStyle = (
  params: CellClassParams<UmowaWithExpanded>
): React.CSSProperties => {
  const data = params.data;
  return data?._expanded !== "inline"
    ? { backgroundColor: "#f1f5f9" }
    : { padding: 0, backgroundColor: "#f8fafc" };
};

type BuildColDefsParams = {
  setRowData: React.Dispatch<React.SetStateAction<UmowaWithExpanded[]>>;
  statusy: SlownikStatusUmowy[];
};

export const buildColDefs = ({
  setRowData,
  statusy,
}: BuildColDefsParams): ColDef<UmowaWithExpanded>[] => [
  {
    headerName: "",
    field: "id",
    width: 90,
    minWidth: 90,
    maxWidth: 90,
    filter: false,
    flex: 0,
    colSpan: ({ data }) => (data?._expanded === "inline" ? 14 : 1),
    autoHeight: true,
    cellRenderer: ({ data }: ICellRendererParams<UmowaWithExpanded>) => {
      if (!data) return null;

      if (data._expanded === "inline") {
        return <UmowaDetails data={{ ...data, id: Math.abs(data.id) }} />;
      }

      const isExpanded = !!data._expanded;

      return (
        <div className="flex items-center gap-2 ps-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setRowData((prev) => {
                const updated: UmowaWithExpanded[] = [];
                for (const row of prev) {
                  if (row._expanded === "inline") continue;
                  if (row.id === data.id) {
                    const now = { ...row, _expanded: !isExpanded };
                    updated.push(now);
                    if (!isExpanded) {
                      updated.push({
                        ...row,
                        id: -data.id,
                        _expanded: "inline" as const,
                      });
                    }
                  } else {
                    updated.push({ ...row, _expanded: false });
                  }
                }
                return updated;
              });
            }}
            className="p-1 hover:bg-gray-200 rounded transition-all"
            aria-label="Toggle details"
          >
            {isExpanded ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </button>

          <Link
            href={`/contracts/standard?id=${data.id}`}
            className="p-1 hover:bg-gray-200 rounded transition-all"
            title="Edytuj umowę"
            onClick={(e) => e.stopPropagation()}
          >
            <Pencil size={16} />
          </Link>
        </div>
      );
    },
    cellStyle: (params: CellClassParams<UmowaWithExpanded>) => ({
      ...getSzczegolyCellStyle(params),
    }),
  },

  {
    headerName: "Numer",
    field: "numer",
    filter: "agTextColumnFilter",
    editable: true,
  },
  {
    headerName: "Przedmiot",
    field: "najnowsza_zmiana.przedmiot",
    filter: "agTextColumnFilter",
    editable: true,
  },
  {
    headerName: "Status",
    field: "najnowsza_zmiana.status.id",
    editable: true,
    cellEditor: "agSelectCellEditor",
    cellEditorParams: {
      values: statusy.map((s) => s.id),
    },
    valueFormatter: (params) => {
      const id = params.value?.toString();
      const match = statusy.find((s) => s.id.toString() === id);
      return match?.nazwa ?? "";
    },
  },
  {
    headerName: "Data zawarcia",
    field: "najnowsza_zmiana.data_zawarcia",
    filter: "agDateColumnFilter",
    width: 140,
    minWidth: 140,
    maxWidth: 140,
    flex: 0,
    editable: true,
  },

  {
    headerName: "Waluta",
    field: "najnowsza_zmiana.waluta",
    editable: true,
    cellEditor: "agSelectCellEditor",
    cellEditorParams: {
      values: ["PLN", "EUR", "USD"], // <- zgodnie z choices
    },
    valueFormatter: (params) => {
      const map: Record<string, string> = {
        PLN: "PLN",
        EUR: "EUR",
        USD: "USD",
      };
      return map[params.value] ?? params.value ?? "";
    },
    width: 100,
    minWidth: 100,
    maxWidth: 100,
    flex: 0,
  },

  {
    headerName: "Ramowa",
    field: "czy_ramowa",
    editable: true,
    width: 58,
    minWidth: 57,
    maxWidth: 59,
    flex: 0,
    headerClass: "tw-rotate-header",
  },

  {
    headerName: "Fix",
    field: "czy_dotyczy_konkretnych_uslug",
    editable: true,
    width: 58,
    minWidth: 57,
    maxWidth: 59,
    flex: 0,
    headerClass: "tw-rotate-header",
  },
  {
    headerName: "DORA",
    field: "czy_spelnia_dora",
    editable: true,
    width: 58,
    minWidth: 57,
    maxWidth: 59,
    flex: 0,
    headerClass: "tw-rotate-header",
  },
  {
    headerName: "Wym. kontynuacji",
    field: "czy_wymaga_kontynuacji",
    editable: true,
    width: 61,
    minWidth: 61,
    maxWidth: 61,
    flex: 0,
    headerClass: "tw-rotate-header",
  },
  {
    headerName: "Data kontynuacji",
    field: "wymagana_data_kontynuacji",
    filter: "agDateColumnFilter",
    editable: true,
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
