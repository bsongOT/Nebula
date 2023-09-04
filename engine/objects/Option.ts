import {WebObject} from "./WebObject.js"
import { SelectMenu } from "./";

export class Option<T> extends WebObject<never,SelectMenu<T>>{
  public get value(): string {
    return this.element.innerText;
  }
  public set value(v: string) {
    this.element.innerText = v;
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