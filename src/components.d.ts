import AgDatagridWrapperCe from "./lib/Index";

declare module "vue" {
  export interface GlobalComponents {
    AgDatagridWrapperCe: typeof AgDatagridWrapperCe;
  }
}
