import type { GridOptions } from "ag-grid-community";

export const dataTypeDefinitions: GridOptions["dataTypeDefinitions"] = {
  object: {
    baseDataType: "object",
    extendsDataType: "object"
  }
};
