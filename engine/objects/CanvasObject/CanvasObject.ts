import {Form} from "../../factors/forms/Form"
import { Coord } from "../../coord-system";
import p5 from "p5";
import { WebObject } from "../WebObject";
import { CanvasFamily } from "@/factors/families/CanvasFamily";
import { CanvasEventInvoker } from "@/factors/events/CanvasEventInvoker";

export abstract class CanvasObject extends WebObject{
  public event!:CanvasEventInvoker<this>;
  public family!:CanvasFamily<CanvasObject, CanvasObject, this>;
  public abstract readonly form:Form;
  protected constructor(){
    super()
  }
  protected init(){}
  public abstract update():this;
  public abstract render(p:p5):this;
  public abstract isIn(point:Coord):boolean;
}