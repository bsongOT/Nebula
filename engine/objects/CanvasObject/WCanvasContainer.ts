import { CanvasEventInvoker } from "@/factors/events/CanvasEventInvoker";
import { CanvasFamily } from "@/factors/families/CanvasFamily";
import { Coord } from "../../coord-system";
import { Form } from "../../factors/forms/Form";
import { CanvasObject } from "./CanvasObject"

export class WCanvasContainer extends CanvasObject{
  public form!: Form;
  public static new(){
    const cc = new WCanvasContainer();
    cc.family = new CanvasFamily(cc)
    cc.event = new CanvasEventInvoker(cc)
    cc.form = new Form()
    cc.init()
    return cc;
  }
  protected constructor(){
    super();
  }
  protected init(){
    super.init()
  }
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