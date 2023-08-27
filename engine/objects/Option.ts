import {WebObject} from "./WebObject.js"

export class Option<T> extends WebObject{
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