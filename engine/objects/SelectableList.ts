import {ListView, SelectableItem} from "./index"
import {SelectableObjectOption} from "../types"

export class SelectableList extends ListView{
  private selectedOne:SelectableItem;
  protected option:SelectableObjectOption;
  public children:SelectableItem[]
  public get selection(){
    return this.selectedOne;
  }
  public set selection(v){
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
  constructor(option:SelectableObjectOption, children:SelectableItem[]){
    super(option, children);
  }
  onselect(){
    this.option?.onselect?.()
  }
}