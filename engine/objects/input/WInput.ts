import { Family } from "@/factors/Family";
import { DOMObject } from "../DOMObject";
import { EventQueue } from "@/factors/Event";

export abstract class WInput extends DOMObject{
  protected readonly element!: HTMLInputElement;
  public readonly family!:Family<never, DOMObject, this>
  public readonly change:EventQueue<()=>void>
  public constructor(){
    super("input");
    this.change = new EventQueue()
    this.element.onchange = () => this.change.invoke();
  }
  public setValue(v:string){
    this.value = v;
    return this;
  }
  get value():string {
    return this.element.value;
  }
  set value(value) {
    this.element.value = value;
  }
}