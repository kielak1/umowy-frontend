"use client";

import { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ClientSideRowModelModule,
  ValidationModule,
  TextFilterModule,
  DateFilterModule,
  NumberFilterModule,
  TextEditorModule,
  DateEditorModule,
  SelectEditorModule,
  CheckboxEditorModule,
  ClientSideRowModelApiModule,
  RowAutoHeightModule,
  CellStyleModule,
} from "ag-grid-community";
import { buildColDefs } from "./grid/columns";
import { useContractsGridData } from "./grid/useUmowyData";
import { Umowa, SlownikStatusUmowy } from "./grid/types";
import { useSlownik } from "./hooks/useSlownik";

export default function Home() {
  const [rowData, setRowData] = useState<Umowa[]>([]);
  const { onCellValueChanged, getRowHeight } = useContractsGridData(setRowData);
  const { data: statusy } =
    useSlownik<SlownikStatusUmowy>("slownikstatusumowy");

  return (
    <div className="p-4">
      <div
        className="ag-theme-quartz"
        style={{ height: "800px", width: "2300px" }}
      >
        <AgGridReact
          modules={[
            ClientSideRowModelModule,
            ValidationModule,
            TextFilterModule,
            DateFilterModule,
            TextEditorModule,
            DateEditorModule,
            NumberFilterModule,
            SelectEditorModule,
            CheckboxEditorModule,
            ClientSideRowModelApiModule,
            RowAutoHeightModule,
            CellStyleModule,
          ]}
          rowData={rowData}
          columnDefs={buildColDefs({ setRowData, statusy })}
          defaultColDef={{
            flex: 1,
            minWidth: 120,
            resizable: true,
            filter: true,
          }}
          getRowHeight={getRowHeight}
          getRowId={(params) => String(params.data.id)}
          onCellValueChanged={onCellValueChanged}
          headerHeight={100}
        />
      </div>
    </div>
  );
}
