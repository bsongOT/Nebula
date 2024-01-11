import { Family } from "@/factors/Family";
import { WDraggableList } from "./WDraggableList";
import { WListItem } from "./WListItem";
import { DOMObject } from "../DOMObject";

export class WDraggableItem<T> extends WListItem<T>{
  public readonly family!:Family<DOMObject<any>, WDraggableList<T>, this>
  
  constructor(){
    super()
    this.input.click.register(()=> {
      this.family.parent!.draggee = this;
    })
  }
}