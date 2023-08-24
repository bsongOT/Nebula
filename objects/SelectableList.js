import {ListView} from "./ListView.js"

export class SelectableList extends ListView{
  #selection;
  #onselect;
  get selection(){
    return this.#selection;
  }
  set selection(v){
    let changed = this.selection !== v;
    for (let i of this.children){
      i.selected = false;
      if (i === v) {
        i.selected = true;
      }
    }
    this.#selection = v;
    if (changed) this.onselect()
  }
  constructor(option, children){
    super(option, children);
    this.#onselect = option.onselect;
  }
  onselect(){
    this.#onselect?.()
  }
}