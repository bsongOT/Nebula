import {CanvasObject} from "./CanvasObject"
import {Coord} from "../../utils/math/coord-system"
import { r3 } from "../../utils/math/consts"
import p5 from "p5";

export class Hexagon extends CanvasObject{
  public side = 10;
  public color = "#ffffff";
  public update = () => this;
  public render(p:p5){
    const size = this.side;
    const center = this.position;
    
    p.push()
    p.translate(center.x, center.y)
    p.beginShape();
  
    p.vertex(size * r3 / 2, size * 1 / 2)
    p.vertex(0, size * 1)
    p.vertex(-size * r3 / 2, size * 1 / 2)
    p.vertex(-size * r3 / 2, -size * 1 / 2)
    p.vertex(0, -size)
    p.vertex(size * r3 / 2, -size * 1 / 2)
    p.fill(this.color);
    
    p.endShape(p.CLOSE);
    p.pop()
    return this;
  }
  public isIn(point:Coord):boolean{
    const [tx,ty] = [this.position.x, this.position.y]
    const [dx,dy] = [point.x-tx, point.y-ty]
    
    if (Math.abs(dx)>r3*this.side/2) return false;
    if (Math.abs(dx+r3*dy)>r3*this.side) return false;
    if (Math.abs(dx-r3*dy)>r3*this.side) return false;
    return true;
  }
}