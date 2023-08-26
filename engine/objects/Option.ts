import {WebObject} from "./WebObject.js"

export class Option extends WebObject{
  element:HTMLOptionElement;
  data:any;
  get selected(){
    return this.element.selected
  }
  set selected(v){
    this.element.selected = v;
  }
  constructor(name:string, data:any){
    super("option");
    this.value = name;
    this.data = data ?? name;
  }
}