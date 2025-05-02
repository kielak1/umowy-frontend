"use client";

import { AgGridReact } from "ag-grid-react";
import { ZmianaUmowy } from "./grid/types";
import { useZmianyData } from "./useZmianyData";
import { columnsZmiany } from "./grid/columnsZmiany";
import {
  ClientSideRowModelModule,
  TextEditorModule,
  DateEditorModule,
} from "ag-grid-community";

export default function ZmianyGrid({ umowaId }: { umowaId: number }) {
  const { rowData, onCellValueChanged } = useZmianyData(umowaId);

  return (
    <div>

      <div className="ag-theme-quartz" style={{ height: 200 }}>
        <AgGridReact<ZmianaUmowy>
          modules={[
            ClientSideRowModelModule,
            TextEditorModule,
            DateEditorModule,
          ]}
          rowData={rowData}
          columnDefs={columnsZmiany}
          defaultColDef={{ flex: 1, resizable: true, editable: true }}
          onCellValueChanged={onCellValueChanged}
        />
      </div>
    </div>
  );
}
