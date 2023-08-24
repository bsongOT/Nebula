import {WebObject} from "../WebObject.js"

export class CanvasScreen extends WebObject{
  p;
  constructor(p, w, h, children){
    super("none");
    this.element = p.createCanvas(w, h);
    this.p = p;
    (children??[]).forEach(c => this.adopt(c))
  }
  adopt(obj){
    this.children.push(obj)
    obj.parent = this;
    obj.p = this.p
    return obj;
  }
}