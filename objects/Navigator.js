import {WebObject} from "./WebObject.js"

export class Navigator extends WebObject {
  constructor(option, children){
    super("nav", option, children)
  }
}