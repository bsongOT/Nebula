import {WebObject} from "./WebObject"

export class ButtonObject extends WebObject<any,any>{
  constructor(name:string){
    super("button");
    this.value = name
  }
  public get value():string{
    if (this.children.length === 0)
      return this.element.innerText
    else return "";
  }
  public set value(v:string){
    if (this.children.length === 0)
      this.element.innerText = v;
  }
}