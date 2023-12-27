import {DOMObject} from "./WebObject"
import "../styles/Navigator.css"
import { EventInvoker } from "@/factors/events/Event"
import { Family } from "@/factors/families/Family"
import { DOMFamily } from "@/factors/families/DOMFamily"

export class Navigator extends DOMObject{
  public readonly family!: DOMFamily<DOMObject, DOMObject, Navigator>
  public readonly event: EventInvoker<Navigator>
  constructor(children?:DOMObject[]){
    super("nav")
    this.family.adoptAll(children)
    this.event = new EventInvoker(this, this.element)
  }
}