import {WebObject} from "./WebObject"
import {WoOption} from "../types"

export class ButtonObject extends WebObject<any,any>{
  constructor(name:string, option?:WoOption){
    super("button", option);
    this.element.innerText = name
  }
  public get value():string{
    if (this.children.length === 0)
      return this.element.innerText
    else return "";
  }
  public set value(v:string){
    if (this.children.length === 0)
      this.element.innerText = v;
  }
}