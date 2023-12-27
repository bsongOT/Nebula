import { Form } from "@/factors/forms/Form";
import { Coord } from "../../coord-system";
import { PolygonForm } from "../../factors/forms/PolygonForm";
import { CanvasObject } from "./CanvasObject";
import p5 from "p5";
import { CanvasEventInvoker } from "@/factors/events/CanvasEventInvoker";
import { CanvasFamily } from "@/factors/families/CanvasFamily";

export class WSquare extends CanvasObject{
  public event!: CanvasEventInvoker<this>;
  public family!: CanvasFamily<CanvasObject, CanvasObject, this>;
  public form!: PolygonForm;
  public static new(){
    const s = new WSquare()
    
    s.family = new CanvasFamily(s)
    s.event = new CanvasEventInvoker(s)
    s.form = new PolygonForm()
    s.init()

    return s;
  }
  protected constructor(){
    super()
  }
  protected init(){
    super.init()
  }
  public update() {
    return this
  }
  public render(p:p5) {
    const [x,y] = [this.form.position.x, this.form.position.y]
    const s = this.form.side;
    p.push()
    if (this.form.color)
      p.fill(this.form.color)
    p.rect(x,y,s,s)
    p.pop()

    return this;
  }
  public isIn(point: Coord): boolean {
    const [px, py] = [point.x, point.y];
    const [x, y] = [this.form.position.x, this.form.position.y]
    
    if (px < x) return false;
    if (px > x + this.form.side) return false;
    if (py < y) return false;
    if (py > y + this.form.side) return false;
    
    return true;
  }
}