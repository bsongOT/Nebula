import {WebObject, ListItem} from "./index"

export class SelectableItem extends ListItem{
  private isSelected:boolean;
  get selected(){
    return this.isSelected;
  }
  set selected(v){
    if (v) this.addClass("selected");
    else this.removeClass("selected");
    this.isSelected = v;
  }
  constructor(option:WoOption, children:WebObject[]){
    super(option, children);
    this.isSelected = false;
  }
}