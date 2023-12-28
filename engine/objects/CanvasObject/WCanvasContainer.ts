import { Coord } from "../../coord-system";
import { Form } from "../../factors/forms/Form";
import { CanvasObject } from "./CanvasObject"

export class WCanvasContainer extends CanvasObject{
  public form!: Form;
  public update(){
    return this;
  }
  public render(){
    return this;
  }
  public isIn(_:Coord):boolean{
    return false;
  }
}