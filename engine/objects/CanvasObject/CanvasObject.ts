import {WebObject} from "../WebObject"
import {Form} from "../../infos/Form"
import { Coord } from "../../coord-system";
import p5 from "p5";

export abstract class CanvasObject<F extends Form> extends WebObject<CanvasObject<any>, WebObject<any,any>>{
  public p:p5;
  public form:F;
  public get value(){
    return;
  }
  public set value(_){}
  public constructor(form:F, children?:CanvasObject<any>[]){
    super("none",children);
    this.form = form;
  }
  public adopt<T extends CanvasObject<any>>(obj:T):T{
    this.children.push(obj)
    obj.parent = this;
    obj.p = this.p;
    return obj;
  }
  public empty(this:CanvasObject<F>){
    this.children = [];
    return this;
  }
  public abstract render():CanvasObject<F>;
  public abstract isIn(point:Coord):boolean;
  protected mouseOver():void{}
}