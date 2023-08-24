import {WebObject} from "./WebObject.js"

export class MultiSelectMenu extends WebObject {
  #option;
  get value(){
    return this.children.filter(o => o.selected).map(o => o.data)
  }
  constructor(option, children){
    super("select")
    this.element.multiple = true;
    for (let o of children??[]){
      this.adopt(o);
    }
    this.#option = option;
    this.element.onchange = ()=>this.change()
  }
  change(){
    this.#option?.onchange?.()
  }
}