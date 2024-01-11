import { Family } from "@/factors/Family";
import { DOMObject } from "../DOMObject";
import { EventQueue } from "@/factors/Event";
import { HTMLObject } from "../WebObject";

export abstract class WInput extends DOMObject<"input">{
  public readonly family!:Family<never, HTMLObject, this>
  public readonly change:EventQueue<()=>void>
  constructor(){
    super("input");
    this.change = new EventQueue()
    this.element.onchange = () => this.change.invoke();
  }
}