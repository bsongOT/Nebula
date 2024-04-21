import p5 from "p5";
import { Coord, P } from "../../utils/math/coord-system";
import { CanvasObject } from "."

export class Line extends CanvasObject{
  public end:Coord;
  constructor(){
    super();
    this.end = P(0, 0)
  }
  public update(){
    return this;
  }
  public render(p:p5){
    const x1 = this.position.x;
    const y1 = this.position.y;
    const x2 = this.end.x;
    const y2 = this.end.y

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