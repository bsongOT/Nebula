import { Family } from "@/factors/Family";
import { HTMLObject, WOption } from "."
import { DOMObject } from "./DOMObject";

export class WSelectMenu<T> extends DOMObject<"select"> {
  public readonly family!: Family<WOption<T>, HTMLObject, this>;
  protected readonly element!:HTMLSelectElement;
  get value(){
    return this.family.children[this.element.selectedIndex].data;
  }
  constructor(){
    super("select")
    const noselect = new WOption<T>("----no selection----")
    noselect.style.display("none");
  }
}