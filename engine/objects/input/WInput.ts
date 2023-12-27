import { InputEventInvoker } from "@/factors/events/InputEventInvoker";
import {DOMObject} from "../WebObject"
import { DOMFamily } from "@/factors/families/DOMFamily";

export abstract class WInput extends DOMObject{
  protected readonly element!: HTMLInputElement;
  public readonly event:InputEventInvoker<WInput>;
  public family:DOMFamily<never, DOMObject, WInput>
  public constructor(){
    super("input");
    this.event = new InputEventInvoker(this, this.element)
    this.family = new DOMFamily(this, this.element)
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