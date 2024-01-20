import { SelectableSpace } from "../../virtual spaces/SelectableSpace";
import { WListView, WSelectableItem } from "."
import { HTMLObject, WebObject } from "../WebObject";
import { DOMObject } from "../DOMObject";
import { Family } from "@/factors/Family";
import { EventQueue } from "@/factors/Event";

export class WSelectableList<T> extends WListView<T>{
  public readonly family!:Family<WSelectableItem<T>, HTMLObject, this>
  public readonly select:EventQueue<()=>void>
  private space:SelectableSpace<WSelectableItem<T>>
  public get selection(){
    return this.space.selection;
  }
  public set selection(v:WSelectableItem<T>|undefined){
    let changed = this.selection !== v;
    this.space.selection = v;
    if (changed) this.select.invoke()
  }
  constructor(){
    super();
    this.space = new SelectableSpace<WSelectableItem<T>>();
    this.select = new EventQueue();
    this.family.event.adopt.register((obj)=>this.space.regist(obj))
  }
}