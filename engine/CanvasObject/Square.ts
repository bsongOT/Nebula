import { Coord, P } from "../utils/math/coord-system";
import { CanvasObject } from "./CanvasObject";
import p5 from "p5";

export class Square extends CanvasObject{
  public position;
  public side;
  public color:string|undefined
  constructor(){
    super()
    this.position = P(0, 0)
    this.side = 10;
  }
  public update() {
    return this
  }
  public render(p:p5) {
    const [x,y] = [this.position.x, this.position.y]
    const s = this.side;
    p.push()
    if (this.color)
      p.fill(this.color)
    p.rect(x,y,s,s)
    p.pop()

    return this;
  }
  public isIn(point: Coord): boolean {
    const [px, py] = [point.x, point.y];
    const [x, y] = [this.position.x, this.position.y]
    
    if (px < x) return false;
    if (px > x + this.side) return false;
    if (py < y) return false;
    if (py > y + this.side) return false;
    
    return true;
  }
}