import {WebObject, Option} from "./index"

export class SelectMenu extends WebObject {
  element:HTMLSelectElement;
  children:Option[]
  get value(){
    return this.children[this.element.selectedIndex].data;
  }
  constructor(children){
    super("select", {}, children)
    this.element.onchange = ()=>this.change()
  }
  change(){}
}