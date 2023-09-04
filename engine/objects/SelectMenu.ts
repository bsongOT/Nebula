import {WebObject, Option} from "./"

export class SelectMenu<T> extends WebObject<Option<T>,any> {
  element:HTMLSelectElement;
  get value(){
    return this.children[this.element.selectedIndex].data;
  }
  constructor(children:Option<T>[]){
    super("select", children)
  }
  public onchange(onchange:()=>void):SelectMenu<T>{
    this.element.onchange = onchange;
    return this;
  }
}