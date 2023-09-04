import {WebObject} from "../WebObject"
import {CanvasObject} from "./CanvasObject"
import p5 from "p5"

export class CanvasScreen extends WebObject<CanvasObject<any>, any>{
  private p:p5;
  constructor(p:p5, w:number, h:number, children?:CanvasObject<any>[]){
    super("none");
    this.element = p.createCanvas(w, h).elt;
    this.p = p;
    (children??[]).forEach(c => this.adopt(c))
  }
  public get value(){
    return;
  }
  public adopt<T extends CanvasObject<any>>(obj:T):T{
    this.children.push(obj)
    obj.parent = this;
    obj.p = this.p
    return obj;
  }
}