import { Family } from "@/factors/Family";
import { WListView } from ".";
import "../../styles/ListItem.css"
import { DOMObject } from "../DOMObject";

export class WListItem<T> extends DOMObject{
  public readonly family!:Family<DOMObject, WListView<T>, this>
  public get value(): T|undefined {
    return this.$data;
  }
  protected set value(v: T|undefined) {
    this.$data = v;
  }
  private $data?:T;
  constructor(){
    super("li")
    this.class.add("list-item")
  }
  public data(value?:T){
    this.value = value;
  }
}