import { EventInvoker } from "@/factors/events/Event";
import { Family } from "@/factors/families/Family";
import {Option, DOMObject} from "./"
import { DOMFamily } from "@/factors/families/DOMFamily";

export class MultiSelectMenu<T> extends DOMObject {
  public readonly family!: DOMFamily<Option<T>, DOMObject, MultiSelectMenu<T>>;
  public readonly event: EventInvoker<MultiSelectMenu<T>>;
  protected readonly element!:HTMLSelectElement;
  public get value():(T|string)[]{
    return this.family.children.filter(o => o.selected).map(o => o.data)
  }
  constructor(children?:Option<T>[]){
    super("select")
    this.element.multiple = true;
    this.family.adoptAll(children)
    this.event = new EventInvoker(this, this.element)
  }
}