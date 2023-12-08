<template>
  <button @click="refetch">refetch</button>
  <AgDataGridWrapper :data="dataSource" :columns="columns" />
</template>

<script setup lang="ts">
import AgDataGridWrapper from "./components/AgDatagridWrapper.ce.vue";
import { onMounted } from "vue";
import { shallowRef } from "vue";
import type { AgTableColumn, AgTableRowData } from "@/components/columnDefinitions/types.ts";

const dataSource = shallowRef<AgTableRowData>([]);
const columns = shallowRef<AgTableColumn[]>([]);

function refetch() {
  generateRowData();
}

onMounted(() => {
  generateColumnDefs();
  generateRowData();
});

function generateColumnDefs() {
  const columnDefs: AgTableColumn[] = [];

  for (let i = 0; i < 100; i++) {
    let type;
    const rand = Math.random();
    if (rand < 0.25) {
      type = "string";
    } else if (rand < 0.5) {
      type = "date";
    } else if (rand < 0.75) {
      type = "textArea";
    } else {
      type = "number";
    }

    columnDefs.push({
      headerName: `Column ${i}, type: ${type}`,
      field: `field${i}`,
      type: type
    });
  }

  columns.value = columnDefs;
}

function generateRowData() {
  const rowData: AgTableRowData[] = [];

  for (let i = 0; i < 100; i++) {
    const row: any = {};
    for (let j = 0; j < columns.value.length; j++) {
      const columnType = columns.value[j].type;

      if (j === 0 && columnType === "rowSelection") {
        continue;
      }

      if (columnType === "string") {
        row[`field${j}`] = `Test${i}`;
      } else if (columnType === "textArea") {
        row[`field${j}`] =
          `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.`;
      } else if (columnType === "date") {
        row[`field${j}`] = new Date(2022, 0, i + 1).toISOString();
      } else if (columnType === "number") {
        row[`field${j}`] = i;
      }
    }
    rowData.push(row);
  }

  dataSource.value = rowData;
}
</script>
