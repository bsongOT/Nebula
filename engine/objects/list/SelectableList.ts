import { SelectableSpace } from "../../virtual spaces/SelectableSpace";
import {ListView, SelectableItem} from "."

export class SelectableList<T> extends ListView<T, SelectableItem<T>>{
  private space:SelectableSpace<SelectableItem<T>>
  public get selection():SelectableItem<T>{
    return this.space.selection;
  }
  public set selection(v:SelectableItem<T>){
    let changed = this.selection !== v;
    this.space.selection = v;
    if (changed) this.$onselect?.()
  }
  private $onselect?:()=>void;
  constructor(children?:SelectableItem<T>[]){
    super(children);
    this.space = new SelectableSpace<SelectableItem<T>>();
  }
  public adopt<C extends SelectableItem<T>>(obj:C){
    super.adopt(obj);
    this.space.regist(obj);
    return obj;
  }
  public onselect(onselect:()=>void){
    this.$onselect = onselect;
    return this;
  }
}