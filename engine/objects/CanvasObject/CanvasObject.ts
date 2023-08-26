import {WebObject} from "../WebObject"
import {Coord} from "../CanvasObjectInfo"

export class CanvasObject extends WebObject{
  p:p5;
  pos:Coord;
  children:CanvasObject[]
  constructor(pos:Coord, children?:CanvasObject[]){
    super("none",{},children);
    this.pos=pos
  }
  adopt(obj:CanvasObject):CanvasObject{
    this.children.push(obj)
    obj.parent = this;
    obj.p = this.p;
    return obj;
  }
  empty():CanvasObject{
    this.children = [];
    return this;
  }
  render():void{}
  isIn(x:number, y:number):boolean{return false;}
  click():void{}
  mouseOver():void{}
}