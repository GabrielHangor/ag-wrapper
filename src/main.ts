import { createApp } from "vue";
import App from "./App.vue";
import AgDatagridWrapperCe from "./lib/Index";

customElements.define("ag-datagrid-wrapper-ce", AgDatagridWrapperCe);

createApp(App).mount("#app");
