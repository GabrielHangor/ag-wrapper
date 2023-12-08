import AgDatagridWrapper from "@/components/AgDatagridWrapper.ce.vue";
import { defineCustomElement } from "vue";

import style from "../components/style.css";

// @ts-ignore
const AgDatagridWrapperCe = defineCustomElement<InstanceType<typeof AgDatagridWrapper>>({
  ...AgDatagridWrapper,
  styles: [style]
});

export default AgDatagridWrapperCe;
