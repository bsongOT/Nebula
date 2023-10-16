import { Coord } from "../../coord-system";
import { PolygonForm } from "../../infos/PolygonForm";
import { CanvasObject } from "./CanvasObject";

export class Square extends CanvasObject<PolygonForm>{
  public update():Square {
    return this
  }
  public render():Square {
    const p = this.p;
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
  constructor(form:PolygonForm, children?:CanvasObject<any>[]){
    super(form, children);
  }
}