import {WebObject, ListItem} from "./index"
import {WoOption} from "../types"

export class ListView extends WebObject{
  constructor(option:WoOption, children:ListItem[]){
    super("ul", option, children);
    this.addClass("list")
  }
}