import { Family } from "@/factors/Family";
import { WOption, HTMLObject } from "."
import { DOMObject } from "./DOMObject";

export class WMultiSelectMenu<T> extends DOMObject {
  public readonly family!: Family<WOption<T>, HTMLObject, this>;
  protected readonly element!:HTMLSelectElement;
  public get value():(T|string)[]{
    return this.family.children.filter(o => o.selected).map(o => o.data)
  }
  constructor(){
    super("select")
    this.element.multiple = true;
  }
}