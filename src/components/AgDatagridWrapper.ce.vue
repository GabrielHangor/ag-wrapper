<template>
  <h1 style="color: red">{{ errors.size }}</h1>
  <ag-grid-vue
    class="ag-theme-alpine"
    style="height: 60vh"
    :columnDefs="columns"
    :rowData="rowData"
    :columnTypes="columnTypes"
    :dataTypeDefinitions="dataTypeDefinitions"
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
  ></ag-grid-vue>
</template>

<script setup lang="ts">
import { AgGridVue } from "ag-grid-vue3";
import "ag-grid-enterprise";
import type { CellValueChangedEvent, ColDef, DetailGridInfo } from "ag-grid-community";
import { computed, ref, shallowRef, watch } from "vue";
import { columnTypes } from "@/components/columnDefinitions/columns.ts";
import { dataTypeDefinitions } from "@/components/dataTypesDefinitions/dataTypes.ts";
import isEqual from "lodash/isEqual";
import cloneDeep from "lodash/cloneDeep";

import type { AgGridWrapperProps, AgGridApi, AgTableColumn, ValidationError } from "./types";

const total = [{ rowSelection: "Total" }];

const props = withDefaults(defineProps<AgGridWrapperProps>(), {
  shouldValidate: true,
  highlightChangedCells: true,
  selectable: true,
  data: () => [],
  columns: () => []
});

const emit = defineEmits<{ initialized: [gridApi: AgGridApi] }>();

const rowData = computed(() => cloneDeep(props.data));

const columns = computed<AgTableColumn[]>(() => {
  if (!rowData.value.length) return [];

  return [...(props.selectable ? [{ type: "rowSelection" } as AgTableColumn] : []), ...props.columns];
});

const gridApi = ref<AgGridApi | null>(null);

const onGridReady = (params: DetailGridInfo) => {
  const patchedGridApi = params.api as AgGridApi;
  patchedGridApi.validateCell = validateCell;
  patchedGridApi.reflectCellChanges = reflectCellChanges;
  gridApi.value = patchedGridApi;
  emit("initialized", patchedGridApi);
};

function dataChanged(data) {
  // console.log(data);
}

const errors = ref(new Map<string, ValidationError>());
const initialData = shallowRef(new Map<string, any>());
const editedCells = shallowRef(new Map<string, any>());

watch(
  () => props.data,
  (newData, oldData) => {
    if (newData !== oldData) {
      initialData.value.clear();
      editedCells.value.clear();
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
  reflectCellChanges(params);
  validateCell(params);

  gridApi.value?.refreshCells({
    rowNodes: [params.node],
    columns: [params.column.getColId()],
    force: true,
    suppressFlash: true
  });
}

function reflectCellChanges(params: CellValueChangedEvent) {
  if (props.highlightChangedCells) {
    const key = `${params.node.rowIndex}-${params.column.getColId()}`;
    const initialValue = initialData.value.get(key);
    const currentValue = params.value;

    if (!isEqual(initialValue, currentValue)) {
      editedCells.value.set(key, currentValue);
    } else {
      editedCells.value.delete(key);
    }
  }
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

async function validateCell(params: CellValueChangedEvent) {
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
  resizable: true,
  wrapHeaderText: true,
  autoHeaderHeight: true,
  sortable: false,
  menuTabs: [],
  suppressMovable: true,
  cellClassRules: {
    "non-editable": (params) => !params.column.isCellEditable(params.node),
    "total-cell": (params) => !!params.node.rowPinned,
    "cell-changed": (params) => {
      const key = `${params.node.rowIndex}-${params.column.getColId()}`;
      return editedCells.value.has(key);
    },
    "invalid-cell": (params) => !!errors.value.get(`${params.node.rowIndex}-${params.column.getColId()}`)
  }
};
</script>
