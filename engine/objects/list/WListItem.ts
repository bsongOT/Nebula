import { Family } from "@/factors/Family";
import { WListView } from ".";
import "../../styles/ListItem.css"
import { DOMObject } from "../DOMObject";

export class WListItem<T> extends DOMObject<"li">{
  public readonly family!:Family<DOMObject<any>, WListView<T>, this>
  public data:T|undefined;
  constructor(data?:T){
    super("li")
    this.data = data;
    this.class.add("list-item")
  }
}