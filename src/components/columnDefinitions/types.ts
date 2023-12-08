import type { ColDef } from "ag-grid-community";

export type AgTableColumn = ColDef & {
  validator?: (params: any) => boolean;
  type?: AgTableColumnType | Array<AgTableColumnType>;
};

export type AgTableColumnType =
  | "string"
  | "date"
  | "number"
  | "textArea"
  | "singleSelect"
  | "multiSelect"
  | "rowSelection";

export type AgTableRowData = Array<Record<string, any>>;

export type ValidationError = {
  rowIndex: number;
  colId: string;
  errorMessage: string;
};
