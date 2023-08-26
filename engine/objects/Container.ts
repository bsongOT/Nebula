import {WebObject} from "./WebObject"

export class Container extends WebObject{
  constructor(option:WoOption, children:WebObject[]){
    super("div", option, children);
    this.addClass("container");
    if (option?.value)
      this.value = option.value
  }
}