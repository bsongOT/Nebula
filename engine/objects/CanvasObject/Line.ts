import {CanvasObject} from "./index"

export class Line extends CanvasObject{
  public start:Coord;
  public end:Coord;
  public color:string;
  constructor(start:Coord, end:Coord){
    super(start);
    this.start = start;
    this.end = end;
  }
  render(){
    const x1 = this.start.x;
    const y1 = this.start.y;
    const x2 = this.end.x;
    const y2 = this.end.y
    const p = this.p;
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
  }
}