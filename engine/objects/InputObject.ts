import {WebObject} from "./WebObject"
import {IoOption} from "../types"

export class InputObject extends WebObject<never,WebObject<any,any>>{
  protected element:HTMLInputElement
  option:IoOption
  constructor(option?:IoOption){
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