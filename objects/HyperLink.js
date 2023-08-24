import {WebObject} from "./WebObject.js"

export class HyperLink extends WebObject{
  constructor(name, path){
    super("a")
    this.element.href = path;
    this.element.innerText = name;
  }
}