import { Coord } from "../../coord-system/";
import { Form } from "../../infos/Form";
import {CanvasObject} from "./CanvasObject"

export class CanvasContainer extends CanvasObject<Form>{
  constructor(children?:CanvasObject<any>[]){
    super(new Form(new Coord(0,0)), children);
  }
  public render():CanvasContainer{
    return this;
  }
  public isIn(_:Coord):boolean{
    return false;
  }
}