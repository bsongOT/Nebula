import { Family } from "@/factors/Family";
import { HTMLObject, WOption } from "."
import { DOMObject } from "./DOMObject";
import { EventQueue } from "@/factors/Event";

export class WSelectMenu<T> extends DOMObject<"select"> {
  public readonly family!: Family<WOption<T>, HTMLObject, this>;
  public readonly event:{change:EventQueue<()=>void>}
  get selectedOption(){
    return this.family.children[this.element.selectedIndex];
  }
  get selectedData(){
    return this.selectedOption?.data
  }
  constructor(){
    super("select")
    this.event = {
      change: new EventQueue()
    }
    this.element.onchange = ()=>this.event.change.invoke()
    const noselect = new WOption<T>("----no selection----")
    noselect.style.display("none");
  }
  public onchange(onchange:()=>void){
    this.event.change.setListener(onchange)
    return this
  }
}