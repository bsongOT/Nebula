import {Form} from "../../factors/forms/Form"
import { Coord } from "../../coord-system";
import p5 from "p5";
import { WebObject } from "../WebObject";
import { Family } from "@/factors/Family";
import { WCanvas } from "./WCanvas";

export abstract class CanvasObject extends WebObject{
  public readonly family!:Family<CanvasObject, CanvasObject|WCanvas, this>;
  public abstract readonly form:Form;
  public abstract update():this;
  public abstract render(p:p5):this;
  public abstract isIn(point:Coord):boolean;
}