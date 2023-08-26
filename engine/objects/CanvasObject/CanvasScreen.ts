import {WebObject} from "../WebObject"
import {CanvasObject} from "./CanvasObject"

export class CanvasScreen extends WebObject{
  p:p5;
  constructor(p:p5, w:number, h:number, children:CanvasObject[]){
    super("none");
    this.element = p.createCanvas(w, h);
    this.p = p;
    (children??[]).forEach(c => this.adopt(c))
  }
  adopt(obj:CanvasObject):CanvasObject{
    this.children.push(obj)
    obj.parent = this;
    obj.p = this.p
    return obj;
  }
}