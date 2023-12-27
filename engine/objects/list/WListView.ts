import { ListItem } from ".";
import {DOMObject} from ".."
import "../../styles/List.css"
import { DOMFamily } from "@/factors/families/DOMFamily";
import { NeverOccuredEvent } from "@/factors/events/NeverOccurredEvent";

export class WListView<T> extends DOMObject{
  public readonly event:NeverOccuredEvent<WListView<T>>;
  public readonly family!:DOMFamily<ListItem<T>, DOMObject, this>
  constructor(children?:ListItem<T>[]){
    super("ul");
    this.event = new NeverOccuredEvent()
    this.family.adoptAll(children)
    this.class.add("list")
  }
}