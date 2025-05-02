"use client";

import { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ClientSideRowModelModule,
  ValidationModule,
  TextFilterModule,
  DateFilterModule,
  TextEditorModule,
  DateEditorModule,
  SelectEditorModule,
  CheckboxEditorModule,
  ClientSideRowModelApiModule,
} from "ag-grid-community";
import { buildColDefs } from "./grid/columns";
import { useContractsGridData } from "./grid/useUmowyData";
import { Umowa } from "./grid/types";

export default function Home() {
  const [rowData, setRowData] = useState<Umowa[]>([]);
  const { onCellValueChanged, getRowHeight } = useContractsGridData(setRowData);

  return (
    <div className="p-4">
      <div className="ag-theme-quartz" style={{ height: "800px", width: "100%" }}>
        <AgGridReact
          modules={[
            ClientSideRowModelModule,
            ValidationModule,
            TextFilterModule,
            DateFilterModule,
            TextEditorModule,
            DateEditorModule,
            SelectEditorModule,
            CheckboxEditorModule,
            ClientSideRowModelApiModule,
          ]}
          rowData={rowData}
          columnDefs={buildColDefs(setRowData)}
          defaultColDef={{ flex: 1, minWidth: 120, resizable: true }}
          getRowHeight={getRowHeight}
          getRowId={(params) => String(params.data.id)}
          onCellValueChanged={onCellValueChanged}
        />
      </div>
    </div>
  );
}
