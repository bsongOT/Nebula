import {WebObject} from "./WebObject.js"

export class Container extends WebObject{
  constructor(option, children){
    super("div", option, children);
    this.addClass("container");
    if (option?.value)
      this.value = option.value
  }
}