import { EventInvoker } from "@/factors/events/Event";
import { DOMObject } from ".";
import { Family } from "@/factors/families/Family";
import { DOMFamily } from "@/factors/families/DOMFamily";

export class WText extends DOMObject{
  public readonly family!: DOMFamily<never, DOMObject, this>
  public readonly event: EventInvoker<this>;
  public get value(): string {
    return this.element.innerText;
  }
  public set value(v: string) {
    this.element.innerText = v;
  }
  constructor(text:string){
    super("span");
    this.class.add("text")
    this.value = text;
    this.event = new EventInvoker(this, this.element)
  }
}