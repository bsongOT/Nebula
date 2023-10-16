import {WebObject} from "./WebObject"
import "../styles/HyperLink.css"

export class HyperLink extends WebObject<never,WebObject<any,any>>{
  protected element:HTMLAnchorElement;
  public get value(){return this.element.href;}

  constructor(name:string, path:string){
    super("a")
    this.element.href = path;
    this.element.innerText = name;
  }
}