import {WebObject} from "./WebObject"
import "../styles/all.css"

export class BodyObject extends WebObject<any,any>{
  constructor(children:WebObject<any,any>[]){
    super("none");
    this.element = document.body;
    for (let c of children ?? [])
      this.adopt(c)
  }
  public get value(){
    return
  }
}