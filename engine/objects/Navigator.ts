import {WebObject} from "./WebObject.js"

export class Navigator extends WebObject {
  constructor(option:WoOption, children:WebObject[]){
    super("nav", option, children)
  }
}