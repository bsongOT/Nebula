import {WebObject} from "./WebObject.js"

export class InputObject extends WebObject{
  #onchange;
  constructor(option){
    super("input");
    if (option?.type){
      this.element.type = option.type;
      if (option.type === "number")
        this.value = 0;
    }
    if (option?.value)
      this.value = option.value
    this.#onchange = option?.onchange;
    this.element.onchange = ()=>this.change()
    this.element.oninput = ()=>this.typing()
  }
  change(){
    this.#onchange?.()
  }
  typing(){}
  get value() {
    return this.element.value;
  }
  set value(value) {
    this.element.value = value;
  }
}