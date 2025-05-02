"use client";

import { AgGridReact } from "ag-grid-react";
import {
  ClientSideRowModelModule,
  TextEditorModule,
  DateEditorModule,
  SelectEditorModule,
} from "ag-grid-community";
import { useZamowieniaData } from "./grid/useZamowieniaData";
import { columnsZamowienia } from "./grid/columnsZamowienia";
import { Zamowienie } from "./grid/types";

interface Props {
  umowaId: number;
}

export default function ZamowieniaGrid({ umowaId }: Props) {
  const { rowData, onCellValueChanged } = useZamowieniaData(umowaId);

  return (
    <div className="ag-theme-quartz mt-2" style={{ height: 250, width: "100%" }}>
      <AgGridReact<Zamowienie>
        modules={[
          ClientSideRowModelModule,
          TextEditorModule,
          DateEditorModule,
          SelectEditorModule,
        ]}
        rowData={rowData}
        columnDefs={columnsZamowienia}
        defaultColDef={{ flex: 1, resizable: true, minWidth: 100 }}
        onCellValueChanged={onCellValueChanged}
        suppressMovableColumns
        domLayout="autoHeight"
      />
    </div>
  );
}
