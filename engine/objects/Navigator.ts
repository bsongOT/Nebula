import {WebObject} from "./WebObject"
import "../styles/Navigator.css"

export class Navigator extends WebObject<WebObject<any,any>,WebObject<any,any>> {
  public get value(){
    throw new Error("Method not implemented.")
  }
  public set value(_) {
    throw new Error("Method not implemented.")
  }
  constructor(children?:WebObject<any,any>[]){
    super("nav", children)
  }
}