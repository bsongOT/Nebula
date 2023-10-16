import {WebObject, Option} from "./"

export class SelectMenu<T> extends WebObject<Option<T>,any> {
  element:HTMLSelectElement;
  get value(){
    return this.children[this.element.selectedIndex].data;
  }
  constructor(children:Option<T>[]){
    const noselect = new Option<T>("----no selection----")
    noselect.style.display = "none";
    super("select", [noselect, ...children])
  }
  public onchange(onchange:()=>void):SelectMenu<T>{
    this.element.onchange = onchange;
    return this;
  }
}