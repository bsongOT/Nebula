import {WebObject, ListItem} from "./index"

export class ListView<T, C extends ListItem<T, ListView<T,any>>> extends WebObject<C,any>{
  public get value(): any {
    throw new Error("Method not implemented.");
  }
  public set value(v: any) {
    throw new Error("Method not implemented.");
  }
  constructor(children?:C[]){
    super("ul", children);
    this.addClass("list")
  }
}