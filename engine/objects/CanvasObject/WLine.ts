import p5 from "p5";
import { Coord } from "../../coord-system";
import { Form } from "../../factors/forms/Form";
import {CanvasObject} from "."
import { CanvasEventInvoker } from "@/factors/events/CanvasEventInvoker";
import { CanvasFamily } from "@/factors/families/CanvasFamily";
import { LineForm } from "@/factors/forms/LineForm";

export class WLine extends CanvasObject{
  public event!: CanvasEventInvoker<this>;
  public family!: CanvasFamily<CanvasObject, CanvasObject, this>;
  public form!: LineForm;
  public static new(start:Coord, end:Coord){
    const l = new WLine()

    l.family = new CanvasFamily(l)
    l.event = new CanvasEventInvoker(l)
    l.form = new LineForm()
                 .moveStartAt(start)
                 .moveEndAt(end)
    l.init()

    return l;
  }
  protected constructor(){ super(); }
  protected init(){
    super.init()
  }
  public update(){
    return this;
  }
  public render(p:p5){
    const x1 = this.form.start.x;
    const y1 = this.form.start.y;
    const x2 = this.form.end.x;
    const y2 = this.form.end.y

    p.push();
    p.strokeWeight(5)
    p.stroke("#d33277")
    p.line(x1, y1, x2, y2)
    p.pop();
    p.push();
    p.strokeWeight(3)
    p.stroke("#ffffff")
    p.line(x1, y1, x2, y2)
    p.pop()

    return this;
  }
  public isIn(_:Coord){
    return false;
  }
}