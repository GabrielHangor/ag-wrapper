<template>
  <button @click="refetch">refetch</button>
  <button @click="addRow">add new row</button>
  <AgDataGridWrapper :data="dataSource" :columns="columns" @initialized="(api) => (agGridInstance = api)" />
</template>

<script setup lang="ts">
import AgDataGridWrapper from "./components/AgDatagridWrapper.ce.vue";
import { onMounted, ref, shallowRef } from "vue";

import type { RowDataTransaction } from "ag-grid-community";
import type { AgTableRowData, AgTableColumn, AgGridApi } from "./components/types";
import type { CellValueChangedEvent } from "ag-grid-community";
import type { ColDef } from "ag-grid-community";

const dataSource = shallowRef<AgTableRowData>([]);
const columns = shallowRef<AgTableColumn[]>([]);
const agGridInstance = ref<AgGridApi | null>(null);

async function refetch() {
  await generateRowData();
}

onMounted(async () => {
  await Promise.all([generateColumnDefs(), generateRowData()]);
});

async function generateColumnDefs() {
  const columnsRaw = (await import("./mockData/columns.json")).default;

  columns.value = columnsRaw.map((column) => {
    return {
      field: column.data,
      headerName: column.title,
      editable: (params) => {
        return !column.settings.readOnly && !params.node.isRowPinned();
      },
      width: column?.settings.width,
      type: column?.settings.type,

    } as AgTableColumn;
  });
}

async function generateRowData() {
  const dataRaw = (await import("./mockData/placement.json")).default;
  dataSource.value = Array.from({ length: 5 }, () => JSON.parse(JSON.stringify(dataRaw))).flat();
}

async function addRow() {
  const newRow = { danboId: 5, agencyId: 10 };
  const transaction: RowDataTransaction = { add: [newRow] };

  const result = agGridInstance.value?.applyTransaction(transaction);
  const newNode = result?.add[0];

  if (newNode) {
    const columns = agGridInstance.value?.getColumnDefs() as ColDef[];

    columns?.forEach((colDef) => {
      if (colDef.field) {
        const params = {
          node: newNode,
          data: newRow,
          column: { getColId: () => colDef.field },
          colDef: colDef,
          value: newRow[colDef.field],
          api: agGridInstance.value,
          type: colDef.type
        };

        agGridInstance.value?.validateCell(params as CellValueChangedEvent);
        agGridInstance.value?.reflectCellChanges(params as CellValueChangedEvent);
      }
    });

    agGridInstance.value?.refreshCells({
      rowNodes: [newNode],
      force: true,
      suppressFlash: true
    });
  }
}
</script>
