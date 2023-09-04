import {WebObject, ListItem, SelectableList} from "./index"

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
  public constructor(children?:WebObject<any,any>[]){
    super(children);
    this.isSelected = false;
    this.onclick(()=>{});
  }
  public onclick(onclick:()=>void){
    this.element.onclick = ()=>{
      this.parent.selection = this;
      onclick()
    }
    return this;
  }
}