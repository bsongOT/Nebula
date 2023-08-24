import {WebObject} from "./WebObject.js"

export class Option extends WebObject{
  data;
  get selected(){
    return this.element.selected
  }
  set selected(v){
    this.element.selected = v;
  }
  constructor(name, data){
    super("option");
    this.value = name;
    this.data = data ?? name;
  }
}