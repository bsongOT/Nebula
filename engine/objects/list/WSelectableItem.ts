import { ISelectable } from "../../interfaces/ISelectable";
import { WListItem, WSelectableList } from ".";
import { DOMObject } from "../DOMObject";
import { Family } from "@/factors/Family";

export class WSelectableItem<T> extends WListItem<T> implements ISelectable{
  public readonly family!:Family<DOMObject<any>, WSelectableList<T>, this>
  public get selected(){
    return this.class.contains("selected");
  }
  public set selected(v){
    if (v) this.class.add("selected");
    else this.class.remove("selected");
  }
}