import {WebObject, ListView} from ".."

export class ListItem<T, P extends ListView<T, any>> extends WebObject<WebObject<any,any>,P>{
  public get value(): T {
    return this.data;
  }
  protected set value(v: T) {
    this.data = v;
  }
  private data:T;
  constructor(children?:WebObject<any,any>[]){
    super("li", children)
    this.addClass("list-item")
  }
}