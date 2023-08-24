import {WebObject} from "../WebObject.js"

export class CanvasObject extends WebObject{
  p;
  pos;
  constructor(pos){
    super("none");
    this.pos=pos
  }
  adopt(obj){
    this.children.push(obj)
    obj.parent = this;
    obj.p = this.p;
    return obj;
  }
  empty(){
    this.children = [];
  }
  render(){}
  isIn(){return false;}
  click(){}
  mouseOver(){}
}