import { Coord } from "../../coord-system";
import { Form } from "../../factors/forms/Form";
import { CanvasObject } from "./CanvasObject"

export class Container extends CanvasObject{
  public form!: Form;
  public update = () => this;
  public render = () => this;
  public isIn = () => false;
}