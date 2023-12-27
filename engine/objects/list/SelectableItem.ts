import { ISelectable } from "../../interfaces/ISelectable";
import { ListItem, SelectableList } from "./";
import { DOMFamily } from "@/factors/families/DOMFamily";
import { EventInvoker } from "@/factors/events/Event";
import { DOMObject } from "../WebObject";

export class SelectableItem<T> extends ListItem<T> implements ISelectable{
  public family!:DOMFamily<DOMObject, SelectableList<T>, this>
  public get selected(){
    return this.class.contains("selected");
  }
  public set selected(v){
    if (v) this.class.add("selected");
    else this.class.remove("selected");
  }
  public static new<T>(){
    const si = new SelectableItem<T>()

    si.family = new DOMFamily(si, si.element)
    si.event = new EventInvoker(si, si.element)
    si.init()

    return si;
  }
  protected init(){
    super.init();
    this.event.click.register(()=>{
      this.family.parent!.selection = this;
    })
  }
}