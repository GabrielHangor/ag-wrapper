import type { ICellRendererComp, ICellRendererParams } from "ag-grid-community";

export abstract class BaseRenderer implements ICellRendererComp {
  protected eGui: HTMLElement;
  protected value?: any;

  constructor() {
    this.eGui = this.createGuiElement();
  }

  init(params: ICellRendererParams) {
    this.value = params.value;
    this.eGui.innerHTML = this.value;
  }

  getGui(): HTMLElement {
    return this.eGui;
  }

  refresh(params: ICellRendererParams): boolean {
    this.value = params.value;
    this.eGui.innerHTML = this.value;
    return true;
  }

  destroy(): void {}

  abstract createGuiElement(): HTMLElement;
}
