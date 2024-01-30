import { Family } from "@/factors/Family";
import { WListItem } from ".";
import "../../styles/List.css"
import { DOMObject } from "../DOMObject";
import { HTMLObject } from "../HTMLObject";

export class WListView<T> extends DOMObject<"ul">{
  public readonly family!:Family<WListItem<T>, HTMLObject, this>
  constructor(){
    super("ul");
    this.class.add("list")
  }
}