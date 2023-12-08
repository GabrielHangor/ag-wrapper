<template>
  <button @click="addRow">add new row</button>
  <h1 style="color: red">{{ errors.size }}</h1>
  <ag-grid-vue
    class="ag-theme-alpine"
    style="height: 60vh"
    :columnDefs="columns"
    :columnTypes="columnTypes"
    :defaultColDef="defaultColDef"
    :suppressRowClickSelection="true"
    :supressColumnFilter="true"
    :pinnedBottomRowData="total"
    rowSelection="multiple"
    enable-range-selection
    enableFillHandle
    :getContextMenuItems="() => []"
    undoRedoCellEditing
    @grid-ready="onGridReady"
    @update:modelValue="dataChanged"
    @cellValueChanged="onCellValueChanged"
    :rowData="rowData"
  ></ag-grid-vue>
</template>

<script setup lang="ts">
import { AgGridVue } from "ag-grid-vue3";
import "ag-grid-enterprise";
import type { CellValueChangedEvent, ColDef, DetailGridInfo } from "ag-grid-community";
import type { AgTableColumn, AgTableRowData, ValidationError } from "@/components/columnDefinitions/types.ts";
import { GridApi } from "ag-grid-community";
import { computed, ref, shallowRef, watch } from "vue";
import { columnTypes } from "@/components/columnDefinitions/columns.ts";

const total = [
  {
    id: 0,
    title: "Total",
    description: "Total",
    price: 0,
    isTotalRow: true
  }
];

interface Props {
  data: AgTableRowData;
  columns: AgTableColumn[];
  shouldValidate?: boolean;
  trackInitialValues?: boolean;
  selectable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  shouldValidate: true,
  trackInitialValues: true,
  selectable: true
});

const rowData = computed(() => structuredClone(props.data));
const columns = computed<AgTableColumn[]>(() => [
  ...(props.selectable ? [{ type: "rowSelection" } as AgTableColumn] : []),
  ...props.columns
]);

const gridApi = ref<GridApi | null>(null);

const onGridReady = (params: DetailGridInfo) => {
  gridApi.value = params.api!;
};

function dataChanged(data) {
  // console.log("Data changed", data);
}

function addRow() {
  const newRow = {};
  rowData.value.push(newRow);
  gridApi.value?.setGridOption("rowData", rowData.value);

  const columns = gridApi.value?.getColumnDefs();

  columns!.forEach((colDef) => {
    const params = {
      node: { rowIndex: rowData.value.length - 1 },
      data: newRow,
      value: newRow[colDef.field],
      column: { getColId: () => colDef?.field },
      colDef: colDef
    };

    validateCell(params as CellValueChangedEvent);
  });
}

const errors = ref(new Map<string, ValidationError>());
const initialData = shallowRef(new Map<string, any>());

watch(
  () => props.data,
  (newData, oldData) => {
    if (newData !== oldData) {
      initialData.value.clear();
      errors.value.clear();

      newData.forEach((row, index) => {
        Object.keys(row).forEach((key) => {
          initialData.value.set(`${index}-${key}`, row[key]);
        });
      });
    }
  },
  { immediate: true }
);

function onCellValueChanged(params: CellValueChangedEvent) {
  validateCell(params);
  gridApi.value?.refreshCells({
    rowNodes: [params.node],
    columns: [params.column.getColId()],
    force: true,
    suppressFlash: true
  });
}

function createError(params: CellValueChangedEvent): ValidationError | null {
  if (!params.value) {
    return {
      rowIndex: params.node.rowIndex!,
      colId: params.column.getColId(),
      errorMessage: "Invalid value"
    };
  }

  return null;
}

function validateCell(params: CellValueChangedEvent): void {
  console.log("validating");

  if (params.colDef.type === "rowSelection") {
    return;
  }

  const error = createError(params);

  const key = `${params.node.rowIndex}-${params.column.getColId()}`;

  if (error) {
    errors.value.set(key, error);
  } else {
    errors.value.delete(key);
  }
}

const defaultColDef: ColDef = {
  editable: (params) => !params.node.data.isTotalRow,
  resizable: true,
  sortable: false,
  menuTabs: [],
  suppressMovable: true,
  cellStyle: (params) => {
    return params.colDef.editable ? null : { color: "grey" };
  },
  cellClassRules: {
    "total-cell": (params) => params.data.isTotalRow,
    "cell-changed": (params) => {
      const key = `${params.node.rowIndex}-${params.column.getColId()}`;
      const initialValue = initialData.value.get(key);
      const currentValue = params.value;

      if (initialValue instanceof Date && currentValue instanceof Date) {
        return initialValue.getTime() !== currentValue.getTime();
      }

      return initialValue !== currentValue;
    },
    "invalid-cell": (params) => !!errors.value.get(`${params.node.rowIndex}-${params.column.getColId()}`)
  }
};
</script>
