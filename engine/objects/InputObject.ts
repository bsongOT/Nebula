import {WebObject} from "./WebObject"

export class InputObject extends WebObject{
  element:HTMLInputElement
  constructor(option:WoOption){
    super("input", option);
    if (option?.type){
      this.element.type = option.type;
      if (option.type === "number")
        this.value = "0";
    }
    if (option?.value)
      this.value = option.value
    this.element.onchange = ()=>this.change()
    this.element.oninput = ()=>this.typing()
  }
  change():void{
    this.option?.onchange?.()
  }
  typing():void{}
  get value():string {
    return this.element.value;
  }
  set value(value) {
    this.element.value = value;
  }
}