import { EventInvoker } from "@/factors/events/Event";
import { Family } from "@/factors/families/Family";
import { DOMObject } from "./WebObject"
import { Classifier } from "@/factors/class/Classifier";
import { DOMFamily } from "@/factors/families/DOMFamily";

export class WButton extends DOMObject{
  public readonly class!: Classifier<WButton>;
  public family!: DOMFamily<DOMObject, DOMObject, WButton>;
  public event!: EventInvoker<WButton>;
  public static new(name:string){
    const btn = new WButton(name);

    btn.family = new DOMFamily(btn, btn.element)
    btn.event = new EventInvoker(btn, btn.element)
    btn.init()

    return btn;
  }
  protected constructor(name:string){
    super("button");
    this.element.innerText = name
  }
}