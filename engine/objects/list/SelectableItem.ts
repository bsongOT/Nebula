import { ISelectable } from "../../interfaces/ISelectable";
import {WebObject} from "../"
import { ListItem, SelectableList } from "./";

export class SelectableItem<T> extends ListItem<T, SelectableList<T>> implements ISelectable{
  private $selected:boolean;
  public get selected(){
    return this.$selected;
  }
  public set selected(v){
    if (v) this.addClass("selected");
    else this.removeClass("selected");
    this.$selected = v;
  }
  public constructor(children?:WebObject<any,any>[]){
    super(children);
    this.$selected = false;
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