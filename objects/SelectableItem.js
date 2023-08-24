import {ListItem} from "./ListItem.js"

export class SelectableItem extends ListItem{
  #selected;
  get selected(){
    return this.#selected;
  }
  set selected(v){
    if (v) this.addClass("selected");
    else this.removeClass("selected");
    this.#selected = v;
  }
  constructor(option, children){
    super(option, children);
    this.#selected = false;
  }
}