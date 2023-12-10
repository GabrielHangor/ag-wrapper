import type { CellValueChangedEvent, ColDef, GridApi } from "ag-grid-community";

export type AgTableColumn = ColDef & {
  validator?: (params: any) => boolean;
  type?: AgTableColumnType | Array<AgTableColumnType>;
};

export type AgTableColumnType =
  | "string"
  | "date"
  | "numeric"
  | "textarea"
  | "dropdown"
  | "multiSelect"
  | "rowSelection";

export type AgTableRowData = Array<Record<string, any>>;

export type ValidationError = {
  rowIndex: number;
  colId: string;
  errorMessage: string;
};

/**
 * Represents the extended Grid API with additional functionality.

 */
export type AgGridApi = GridApi & {
  /**
   * Validates a single cell in the grid.
   */
  validateCell: (params: CellValueChangedEvent) => Promise<void>;
  /**
   * Compares the current cell value with the initial value and reflects the changes in the grid.
   */
  reflectCellChanges: (params: CellValueChangedEvent) => void;
};

export type AgGridWrapperProps = {
  data: AgTableRowData;
  columns: AgTableColumn[];
  shouldValidate?: boolean;
  highlightChangedCells?: boolean;
  selectable?: boolean;
};
