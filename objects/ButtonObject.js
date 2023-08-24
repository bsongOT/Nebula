import {WebObject} from "./WebObject.js"

export class ButtonObject extends WebObject{
  constructor(name, option){
    super("button", option);
    this.element.innerText = name
  }
  get value(){
    return this.element.value;
  }
  set value(value){
    this.element.value = value;
  }
}