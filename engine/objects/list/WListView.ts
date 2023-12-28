import { Family } from "@/factors/Family";
import { WListItem } from ".";
import "../../styles/List.css"
import { DOMObject } from "../DOMObject";
import { HTMLObject } from "../WebObject";

export class WListView<T> extends DOMObject{
  public readonly family!:Family<WListItem<T>, HTMLObject, this>
  constructor(){
    super("ul");
    this.class.add("list")
  }
}