import {WebObject} from "./WebObject.js"
import {WoOption} from "../types"

export class Navigator extends WebObject {
  constructor(option:WoOption, children:WebObject[]){
    super("nav", option, children)
  }
}