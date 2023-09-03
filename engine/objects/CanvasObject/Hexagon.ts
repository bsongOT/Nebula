import {CanvasObject} from "./CanvasObject"
import {Coord} from "../../coord-system/"
import { r3 } from "../../utils/mathconsts"
import { PolygonForm } from "../../infos/PolygonForm"

export class Hexagon extends CanvasObject<PolygonForm>{
  constructor(form:PolygonForm){
    super(form);
  }
  public render(){
    const size = this.form.side;
    const center = this.form.position;
    const p = this.p;
    
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
    const r3 = Math.sqrt(3)
    const [tx,ty] = [this.form.position.x, this.form.position.y]
    const [dx,dy] = [point.x-tx, point.y-ty]
    
    if (Math.abs(dx)>r3*this.form.side/2) return false;
    if (Math.abs(dx+r3*dy)>r3*this.form.side) return false;
    if (Math.abs(dx-r3*dy)>r3*this.form.side) return false;
    return true;
  }
}