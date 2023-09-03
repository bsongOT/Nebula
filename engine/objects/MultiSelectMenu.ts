import {WebObject, Option} from "./index"
import {IoOption} from "../types"

export class MultiSelectMenu<T> extends WebObject<Option<T>, any> {
  protected element:HTMLSelectElement;
  option:IoOption;
  public get value():(T|string)[]{
    return this.children.filter(o => o.selected).map(o => o.data)
  }
  set value(_:(T|string)[]){
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