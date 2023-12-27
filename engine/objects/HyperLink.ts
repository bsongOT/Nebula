import {DOMObject} from "./WebObject"
import "../styles/HyperLink.css"
import { EventInvoker } from "@/factors/events/Event";
import { Classifier } from "@/factors/class/Classifier";
import { DOMFamily } from "@/factors/families/DOMFamily";

export class WHyperLink extends DOMObject{
  public readonly family!: Family<never, DOMObject, WHyperLink>;
  public readonly event!: EventInvoker<this>
  protected readonly element!: HTMLAnchorElement;
  public get value(){return this.element.href;}

  constructor(name:string, path:string){
    super("a")
    this.event = new EventInvoker(this, this.element)
    this.element.href = path;
    this.element.innerText = name;
  }
}