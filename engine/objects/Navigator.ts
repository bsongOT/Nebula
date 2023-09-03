import {WebObject} from "./WebObject.js"
import {WoOption} from "../types"

export class Navigator extends WebObject<WebObject<any,any>,WebObject<any,any>> {
  public get value(){
    throw new Error("Method not implemented.")
  }
  public set value(_) {
    throw new Error("Method not implemented.")
  }
  constructor(option:WoOption, children:WebObject<any,any>[]){
    super("nav", option, children)
  }
}