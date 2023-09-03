import {ListView, SelectableItem} from "./index"
import {SelectableObjectOption} from "../types"

export class SelectableList<T> extends ListView<T, SelectableItem<T>>{
  private selectedOne:SelectableItem<T>;
  protected option:SelectableObjectOption;
  public get selection():SelectableItem<T>{
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
  constructor(option?:SelectableObjectOption, children?:SelectableItem<T>[]){
    super(option, children);
  }
  onselect(){
    this.option?.onselect?.()
  }
}