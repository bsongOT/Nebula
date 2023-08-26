import {WebObject, Option} from "./index"

export class MultiSelectMenu extends WebObject {
  element:HTMLSelectElement;
  children:Option[];
  get value():any[]{
    return this.children.filter(o => o.selected).map(o => o.data)
  }
  constructor(option:WoOption, children?:Option[]){
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