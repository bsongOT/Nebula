import {ListView, SelectableItem} from "./index"

export class SelectableList<T> extends ListView<T, SelectableItem<T>>{
  private selectedOne:SelectableItem<T>;
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
    if (changed) this.$onselect()
  }
  private $onselect:()=>void;
  constructor(children?:SelectableItem<T>[]){
    super(children);
  }
  public onselect(onselect:()=>void){
    this.$onselect = onselect;
    return this;
  }
}