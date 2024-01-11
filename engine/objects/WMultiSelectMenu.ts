import { Family } from "@/factors/Family";
import { WOption, HTMLObject } from "."
import { DOMObject } from "./DOMObject";

export class WMultiSelectMenu<T> extends DOMObject<"select"> {
  public readonly family!: Family<WOption<T>, HTMLObject, this>;
  public get selectedOptions(){
    return this.family.children.filter(o => o.selected);
  }
  public get selectedDatas(){
    return this.selectedOptions.map(o => o.data)
  }
  constructor(){
    super("select")
    this.element.multiple = true;
  }
}