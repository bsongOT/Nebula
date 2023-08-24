import {WebObject} from "./WebObject.js"

export class ListView extends WebObject{
  constructor(option, children){
    super("ul", option, children);
    this.addClass("list")
  }
}