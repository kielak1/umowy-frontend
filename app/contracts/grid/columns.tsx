"use client";

import type {
  ColDef,
  ICellRendererParams,
  CellClassParams,
} from "ag-grid-community";
import { Umowa } from "./types";
import UmowaDetails from "../UmowaDetails";
import { ChevronRight, ChevronDown } from "lucide-react";

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
};

export const buildColDefs = ({
  setRowData,
}: BuildColDefsParams): ColDef<UmowaWithExpanded>[] => [
  {
    headerName: "",
    width: 50,
    cellRenderer: ({ data }: ICellRendererParams<UmowaWithExpanded>) => {
      if (!data || data._expanded === "inline") return null;
      const { id, _expanded } = data;
      const isExpanded = !!_expanded;

      return (
        <button
          className="p-1 hover:bg-gray-200 rounded transition-all"
          aria-label="Toggle details"
          onClick={() => {
            setRowData((prev) => {
              const updated: UmowaWithExpanded[] = [];
              for (const row of prev) {
                if (row._expanded === "inline") continue;
                if (row.id === id) {
                  const now = { ...row, _expanded: !isExpanded };
                  updated.push(now);
                  if (!isExpanded) {
                    updated.push({
                      ...row,
                      id: -id,
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
        >
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
      );
    },
    pinned: "left",
    suppressSizeToFit: true,
    menuTabs: [],
  },

  {
    headerName: "Szczegóły",
    field: "id",
    colSpan: ({ data }) => (data?._expanded === "inline" ? 14 : 1),
    autoHeight: true,
    cellRenderer: ({ data }: ICellRendererParams<UmowaWithExpanded>) => {
      if (!data) return null;
  
      if (data._expanded === "inline") {
        return <UmowaDetails data={{ ...data, id: Math.abs(data.id) }} />;
      }
  
      const isExpanded = !!data._expanded;
  
      return (
        <div className="flex items-center gap-2 ps-2">
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
          <span className="text-sm text-gray-800">Szczegóły</span>
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
  { headerName: "Ramowa", field: "czy_ramowa", editable: true },
  {
    headerName: "Dot. usługi",
    field: "czy_dotyczy_konkretnych_uslug",
    editable: true,
  },
  { headerName: "Spełnia DORA", field: "czy_spelnia_dora", editable: true },
  {
    headerName: "Wymaga kontynuacji",
    field: "czy_wymaga_kontynuacji",
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
    filter: "agTextColumnFilter",
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
