import {WebObject} from "./WebObject"
import {WoOption} from "../types"

export class ButtonObject extends WebObject{
  constructor(name:string, option?:WoOption){
    super("button", option);
    this.element.innerText = name
  }
}