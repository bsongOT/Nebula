import {ListView, SelectableItem} from "./index"

export class SelectableList extends ListView{
  private selectedOne:SelectableItem;
  children:SelectableItem[];
  get selection(){
    return this.selectedOne;
  }
  set selection(v){
    let changed = this.selection !== v;
    for (let i of this.children){
      i.selected = false;
      if (i === v) {
        i.selected = true;
      }
    }
    this.selectedOne = v;
    if (changed) this.onselect()
  }
  constructor(option:WoOption, children:SelectableItem[]){
    super(option, children);
  }
  onselect(){
    this.option?.onselect?.()
  }
}