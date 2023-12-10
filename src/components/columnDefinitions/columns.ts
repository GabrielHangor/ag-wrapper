import type { AgTableColumnType, AgTableColumn } from "../types";

export const columnTypes: Partial<Record<AgTableColumnType, AgTableColumn>> = {
  rowSelection: {
    field: "rowSelection",
    headerName: "",
    checkboxSelection: true,
    maxWidth: 40,
    resizable: false,
    suppressFillHandle: true,
    headerCheckboxSelection: true,
    pinned: "left",
    editable: false,
    cellStyle: { border: "none" }
  },
  textarea: {
    cellEditor: "agLargeTextCellEditor",
    cellClass: "ag-textarea-renderer"
  },
  dropdown: {
    cellEditor: "agSelectCellEditor",
    cellEditorParams: { values: [1,2,3] },
    cellDataType: "string"
  },
  date: {
    valueFormatter: (params) => (params.value ? new Date(params.value).toLocaleDateString() : ""),
    valueParser: (params) => {
      if (!params.newValue) return null;

      const dateMatch = params.newValue.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);

      if (dateMatch) {
        const isoDateString = `${dateMatch[3]}-${dateMatch[2]}-${dateMatch[1]}T00:00:00`;
        const parsedDate = new Date(isoDateString);
        return !isNaN(parsedDate.getTime()) ? parsedDate.toISOString() : null;
      }
      return null;
    },
    cellEditor: "agDateCellEditor"
  },
  numeric: {
    valueFormatter: (params) => {
      if (params.value !== null && params.value !== undefined) {
        return parseFloat(params.value)
          .toFixed(2)
          .replace(/\d(?=(\d{3})+\.)/g, "$& ");
      } else {
        return "";
      }
    }
  }
};
