import { SelectableSpace } from "../../virtual spaces/SelectableSpace";
import { WListView, SelectableItem } from "."
import { DOMFamily } from "@/factors/families/DOMFamily";
import { DOMObject, WebObject } from "../WebObject";
import { EventInvoker, EventQueue } from "@/factors/events/Event";

export class SelectableListFamily<C extends SelectableItem<any>, P extends DOMObject, T extends SelectableList<any>> extends DOMFamily<C, P, T>{
  public adopt<T1 extends WebObject>(obj:T1){
    super.adopt(obj);
    (this.me as any).space.regist(obj);
    return obj;
  }
}
export class SelectableListEvent<T extends SelectableList<any>> extends EventInvoker<T>{
  public readonly select:EventQueue;
  constructor(obj:T, element:HTMLElement){
    super(obj, element)
    this.select = new EventQueue()
  }
  public onselect(func:()=>void){
    this.select.modify(func)
    return this.obj;
  }
}
export class SelectableList<T> extends WListView<T>{
  public family!:SelectableListFamily<SelectableItem<T>, DOMObject, this>
  public event!:SelectableListEvent<this>;
  private space:SelectableSpace<SelectableItem<T>>
  public get selection(){
    return this.space.selection;
  }
  public set selection(v:SelectableItem<T>|undefined){
    let changed = this.selection !== v;
    this.space.selection = v;
    if (changed) this.event.select.invoke()
  }
  protected constructor(){
    super();
    this.space = new SelectableSpace<SelectableItem<T>>();
  }
}