import { Family } from "@/factors/Family";
import { DOMObject } from "../DOMObject";
import { EventQueue } from "@/factors/Event";
import { HTMLObject } from "../HTMLObject";

export abstract class WInput extends DOMObject<"input">{
  public readonly family!:Family<never, HTMLObject, this>
  public readonly events:{
    change: EventQueue<()=>void>,
    input: EventQueue<()=>void>
  }
  public get value(){
    return this.element.value
  }
  constructor(){
    super("input");
    this.events = {
      change: new EventQueue(),
      input: new EventQueue()
    }
  }
  public setValue(value:string){
    this.element.value = value
    return this;
  }
  public onchange(onchange:()=>void){
    this.events.change.setListener(onchange)
    this.element.onchange = () => this.events.change.invoke()
    return this;
  }
  public oninput(oninput:()=>void){
    this.events.input.setListener(oninput)
    this.element.oninput = () => this.events.input.invoke()
    return this;
  }
}