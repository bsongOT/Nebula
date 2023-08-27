import {WebObject, Option} from "./index"
import {IoOption} from "../types"

export class MultiSelectMenu<T> extends WebObject {
  element:HTMLSelectElement;
  children:Option<T>[];
  option:IoOption;
  get value():(T|string)[]{
    return this.children.filter(o => o.selected).map(o => o.data)
  }
  set value(v:T[]){
    throw "Wrong Access";
  }
  constructor(option:IoOption, children?:Option<T>[]){
    super("select", option)
    this.element.multiple = true;
    for (let o of children??[]){
      this.adopt(o);
    }
    this.element.onchange = ()=>this.change()
  }
  change(){
    this.option?.onchange?.()
  }
}