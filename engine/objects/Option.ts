import {WebObject} from "./WebObject.js"
import { SelectMenu } from "./";

export class Option<T> extends WebObject<never,SelectMenu<T>>{
  public get value():T|string {
    return this.data;
  }
  public set value(v:T|string) {
    this.data = v;
  }
  element:HTMLOptionElement;
  data:T|string;
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