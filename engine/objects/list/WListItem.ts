import { Family } from "@/factors/families/Family";
import { WListView } from ".";
import { DOMObject } from ".."
import "../../styles/ListItem.css"
import { EventInvoker } from "@/factors/events/Event";
import { DOMFamily } from "@/factors/families/DOMFamily";

export class ListItem<T> extends DOMObject{
  public event!: EventInvoker<this>;
  public family!:DOMFamily<DOMObject, WListView<T>, this>
  public get value(): T|undefined {
    return this.$data;
  }
  protected set value(v: T|undefined) {
    this.$data = v;
  }
  private $data?:T;
  public static new<T>(){
    const li = new ListItem<T>()

    li.family = new DOMFamily(li, li.element)
    li.event = new EventInvoker(li, li.element)
    li.init()

    return li;
  }
  protected constructor(){
    super("li")
    this.class.add("list-item")
  }
  public data(value?:T){
    this.value = value;
  }
}