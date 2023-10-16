import {WebObject} from "./WebObject"
import { SelectMenu } from "./";

export class Option<T> extends WebObject<never,SelectMenu<T>>{
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
  element:HTMLOptionElement;
  public data:T|string;

  get selected(){
    return this.element.selected
  }
  set selected(v){
    this.element.selected = v;
  }
  constructor(name:string, data?:T){
    super("option");
    this.value = name;
    this.data = data ?? name;
  }
}