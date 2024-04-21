import { Coord } from "../../utils/math/coord-system";
import { CanvasObject } from "./CanvasObject"

export class Container extends CanvasObject{
  public update = () => this;
  public render = () => this;
  public isIn = () => false;
}