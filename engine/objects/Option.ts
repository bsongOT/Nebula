import {DOMObject} from "./WebObject"
import { SelectMenu } from "./";
import { EventInvoker } from "@/factors/events/Event";
import { Family } from "@/factors/families/Family";
import { DOMFamily } from "@/factors/families/DOMFamily";

export class Option<T> extends DOMObject{
  public readonly family!: DOMFamily<never, SelectMenu<T>, Option<T>>;
  public readonly event: EventInvoker<Option<T>>;
  public get value(): string {
    return this.element.innerText;
  }
  public set value(v: string) {
    this.element.innerText = v;
  }
  public get disabled():boolean{
    return this.element.disabled;
  }
  public set disabled(v:boolean){
    this.element.disabled = v;
  }
  protected element!:HTMLOptionElement;
  public data:T|string;

  get selected(){
    return this.element.selected
  }
  set selected(v){
    this.element.selected = v;
  }
  constructor(name:string, data?:T){
    super("option");
    this.event = new EventInvoker(this, this.element)
    this.value = name;
    this.data = data ?? name;
  }
}