import { Family } from "@/factors/Family";
import { WOption, HTMLObject } from "."
import { DOMObject } from "./DOMObject";
import { EventQueue } from "@/factors/Event";

export class WMultiSelectMenu<T> extends DOMObject<"select"> {
  public readonly family!: Family<WOption<T>, HTMLObject, this>;
  public readonly event:{
    change:EventQueue<()=>void>
  }
  public get selectedOptions(){
    return this.family.children.filter(o => o.selected);
  }
  public get selectedDatas(){
    return this.selectedOptions.map(o => o.data)
  }
  constructor(){
    super("select")
    this.element.multiple = true;
    this.event = {
      change: new EventQueue()
    }
  }
  public onchange(onchange:()=>void){
    this.event.change.setListener(onchange)
    this.element.onchange = ()=>this.event.change.invoke();
    return this;
  }
}