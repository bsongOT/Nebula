import {WebObject} from "./WebObject"

export class HyperLink extends WebObject{
  element:HTMLAnchorElement
  constructor(name:string, path:string){
    super("a")
    this.element.href = path;
    this.element.innerText = name;
  }
}