import {WebObject} from "./WebObject"

export class Container extends WebObject<WebObject<any,any>,WebObject<any,any>>{
  public get value():any{return;}
  constructor(children?:WebObject<any,any>[]){
    super("div", children);
    this.addClass("container");
  }
}