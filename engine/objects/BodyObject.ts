import {WebObject} from "./WebObject"

export class BodyObject extends WebObject{
  constructor(children:WebObject[]){
    super("none");
    this.element = document.body;
    for (let c of children ?? [])
      this.adopt(c)
  }
}