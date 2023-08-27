import {WebObject, Option} from "./index"

export class SelectMenu<T> extends WebObject {
  element:HTMLSelectElement;
  children:Option<T>[]
  get value(){
    return this.children[this.element.selectedIndex].data;
  }
  constructor(children:Option<T>[]){
    super("select", {}, children)
    this.element.onchange = ()=>this.change()
  }
  change(){}
}