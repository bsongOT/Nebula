import {WebObject, ListItem} from "./index"
import {WoOption} from "../types"

export class ListView<T, C extends ListItem<T, ListView<T,any>>> extends WebObject<C,any>{
  public get value(): any {
    throw new Error("Method not implemented.");
  }
  public set value(v: any) {
    throw new Error("Method not implemented.");
  }
  constructor(option?:WoOption, children?:C[]){
    super("ul", option, children);
    this.addClass("list")
  }
}