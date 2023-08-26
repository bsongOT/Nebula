import {CanvasObject} from "./CanvasObject.js"

export class CanvasContainer extends CanvasObject{
  constructor(children:CanvasObject[]){
    super({}, children);
  }
}