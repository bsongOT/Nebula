import {WebObject, ListItem, SelectableList} from "./index"
import {WoOption} from "../types"

export class SelectableItem<T> extends ListItem<T, SelectableList<T>>{
  private isSelected:boolean;
  public get selected(){
    return this.isSelected;
  }
  public set selected(v){
    if (v) this.addClass("selected");
    else this.removeClass("selected");
    this.isSelected = v;
  }
  public constructor(option?:WoOption, children?:WebObject<any,any>[]){
    super(option, children);
    this.isSelected = false;
  }
  protected click(){
    super.click()
    this.parent.selection = this;
  }
}