import { DOMObject } from "..";
import { WDraggableList } from "./WDraggableList";
import { ListItem } from "./WListItem";
import { DOMFamily } from "@/factors/families/DOMFamily";
import { EventInvoker } from "@/factors/events/Event";

export class WDraggableItem<T> extends ListItem<T>{
  public family!:DOMFamily<DOMObject, WDraggableList<T>, this>
  
  public static new<T>(){
    const di = new WDraggableItem<T>()

    di.family = new DOMFamily(di, di.element)
    di.event = new EventInvoker(di, di.element)
    di.init();

    return di;
  }
  public init(){
    super.init()
    this.event.click.register(()=> {
      this.family.parent!.draggee = this;
    })
  }
}