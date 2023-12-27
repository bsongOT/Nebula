import { EventInvoker } from "@/factors/events/Event";
import { Family } from "@/factors/families/Family";
import {Option, DOMObject} from "./"
import { DOMFamily } from "@/factors/families/DOMFamily";

export class SelectMenu<T> extends DOMObject {
  public readonly family!: DOMFamily<Option<T>, DOMObject, SelectMenu<T>>;
  public readonly event: EventInvoker<SelectMenu<T>>;
  protected readonly element!:HTMLSelectElement;
  get value(){
    return this.family.children[this.element.selectedIndex].data;
  }
  constructor(children:Option<T>[]){
    super("select")
    const noselect = new Option<T>("----no selection----")
    noselect.style.display = "none";
    this.family.adoptAll(children)
    this.event = new EventInvoker(this, this.element)
  }
}