import {WebObject} from "./WebObject"

export class ListItem extends WebObject{
  constructor(option:WoOption, children:WebObject[]){
    super("li", option, children)
    this.addClass("list-item")
  }
}