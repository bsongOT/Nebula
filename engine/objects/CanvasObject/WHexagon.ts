import {CanvasObject} from "./CanvasObject"
import {Coord} from "../../coord-system"
import { r3 } from "../../utils/mathconsts"
import { PolygonForm } from "../../factors/forms/PolygonForm"
import p5 from "p5";
import { CanvasEventInvoker } from "@/factors/events/CanvasEventInvoker";
import { CanvasFamily } from "@/factors/families/CanvasFamily";

export class WHexagon extends CanvasObject{
  public event!: CanvasEventInvoker<this>
  public family!: CanvasFamily<CanvasObject, CanvasObject, this>;
  public form!: PolygonForm;
  public static new(){
    const h = new WHexagon()

    h.family = new CanvasFamily(h)
    h.event = new CanvasEventInvoker(h)
    h.form = new PolygonForm()
    h.init()

    return h;
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
  public render(p:p5){
    const size = this.form.side;
    const center = this.form.position;
    
    p.push()
    p.translate(center.x, center.y)
    p.beginShape();
  
    p.vertex(size * r3 / 2, size * 1 / 2)
    p.vertex(0, size * 1)
    p.vertex(-size * r3 / 2, size * 1 / 2)
    p.vertex(-size * r3 / 2, -size * 1 / 2)
    p.vertex(0, -size)
    p.vertex(size * r3 / 2, -size * 1 / 2)
    p.fill(this.form.color);
    
    p.endShape(p.CLOSE);
    p.pop()
    return this;
  }
  public isIn(point:Coord):boolean{
    const [tx,ty] = [this.form.position.x, this.form.position.y]
    const [dx,dy] = [point.x-tx, point.y-ty]
    
    if (Math.abs(dx)>r3*this.form.side/2) return false;
    if (Math.abs(dx+r3*dy)>r3*this.form.side) return false;
    if (Math.abs(dx-r3*dy)>r3*this.form.side) return false;
    return true;
  }
}