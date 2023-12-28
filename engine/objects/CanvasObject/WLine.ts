import p5 from "p5";
import { Coord } from "../../coord-system";
import { Form } from "../../factors/forms/Form";
import { CanvasObject } from "."
import { LineForm } from "@/factors/forms/LineForm";

export class WLine extends CanvasObject{
  public form!: LineForm;
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