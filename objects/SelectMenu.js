import {WebObject} from "./WebObject.js"

export class SelectMenu extends WebObject {
  get value(){
    return this.children[this.element.selectedIndex].data;
  }
  constructor(children){
    super("select", {}, children)
    this.element.onchange = ()=>this.change()
  }
  change(){}
}