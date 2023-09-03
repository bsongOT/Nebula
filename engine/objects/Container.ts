import {WebObject} from "./WebObject"
import {WoOption} from "../types"

export class Container extends WebObject<WebObject<any,any>,WebObject<any,any>>{
  public get value():any{return;}
  constructor(option?:WoOption, children?:WebObject<any,any>[]){
    super("div", option, children);
    this.addClass("container");
  }
}