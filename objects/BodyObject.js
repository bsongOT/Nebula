import {WebObject} from "./WebObject.js"

export class BodyObject extends WebObject{
  constructor(children){
    super("none");
    this.element = document.body;
    for (let c of children ?? [])
      this.adopt(c)
  }
}