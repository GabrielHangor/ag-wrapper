import type { AgTableColumn, AgTableColumnType } from "@/components/columnDefinitions/types.ts";

export const columnTypes: Partial<Record<AgTableColumnType, AgTableColumn>> = {
  rowSelection: {
    colId: "rowSelection",
    checkboxSelection: true,
    maxWidth: 40,
    resizable: false,
    suppressFillHandle: true,
    headerCheckboxSelection: true,
    pinned: "left",
    editable: false,
    cellStyle: { border: "none" }
  },
  textArea: {
    cellEditor: "agLargeTextCellEditor",
    cellClass: "ag-textarea-renderer"
  },
  date: {
    valueFormatter: (params) => (params.value ? new Date(params.value).toLocaleDateString() : ""),
    valueParser: (params) => {
      console.log(params.oldValue);

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
  number: {
    valueFormatter: (params) => params.value?.toFixed(2)
  },
  string: {}
};
