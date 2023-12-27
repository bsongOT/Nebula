import {DOMObject, WebObject} from "./WebObject"
import "../styles/all.css"
import { EventInvoker } from "@/factors/events/Event";
import { Family } from "@/factors/families/Family";
import { DOMFamily } from "@/factors/families/DOMFamily";

export class WBody extends WebObject{
  private readonly element:HTMLElement;
  public readonly family: HTMLFamily<DOMObject, never, WBody>;
  public readonly event;
  constructor(children:DOMObject[]){
    super();
    this.element = document.body;
    this.family = new DOMFamily(this, this.element, children)
    this.event = new EventInvoker(this, this.element)
  }
}