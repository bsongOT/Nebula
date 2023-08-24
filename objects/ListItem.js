import {WebObject} from "./WebObject.js"

export class ListItem extends WebObject{
  constructor(option, children){
    super("li", option, children)
    this.addClass("list-item")
  }
}