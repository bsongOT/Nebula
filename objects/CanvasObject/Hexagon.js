import {CanvasObject} from "./CanvasObject.js"

export class Hexagon extends CanvasObject{
  #color;
  get color(){
    return this.#color
  }
  set color(v){
    this.#color = v;
  }
  constructor(pos, side, color){
    super(pos)
    this.side = side;
    if (color)
    this.color = color;
  }
  render(){
    const size = this.side;
    const center = this.pos;
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
    p.fill(this.color);
    
    p.endShape(p.CLOSE);
    p.pop()
  }
  isIn(x,y){
    const r3 = Math.sqrt(3)
    const [tx,ty] = [this.pos.x, this.pos.y]
    const [dx,dy] = [x-tx, y-ty]
    
    if (Math.abs(dx)>r3*this.side/2) return;
    if (Math.abs(dx+r3*dy)>r3*this.side) return;
    if (Math.abs(dx-r3*dy)>r3*this.side) return;
    return true;
  }
}