import {WebObject, Option} from "./index"

export class MultiSelectMenu<T> extends WebObject<Option<T>, any> {
  protected element:HTMLSelectElement;
  public get value():(T|string)[]{
    return this.children.filter(o => o.selected).map(o => o.data)
  }
  set value(_:(T|string)[]){
    throw "Wrong Access";
  }
  constructor(children?:Option<T>[]){
    super("select")
    this.element.multiple = true;
    for (let o of children??[]){
      this.adopt(o);
    }
  }
  public onchange(onchange:()=>void){
    this.element.onchange = onchange;
    return this;
  }
}