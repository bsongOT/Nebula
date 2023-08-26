import {r3} from "./mathconsts";

export class Coord{
  x:number;
  y:number;
  constructor(x:number, y:number){
    this.x = x;
    this.y = y;
  }
  add(c2:Coord):Coord{
    return new Coord(
      this.x + c2.x, 
      this.y + c2.y
    )
  }
  sub(c2:Coord):Coord{
    return new Coord(
      this.x - c2.x,
      this.y - c2.y
    )
  }
  eq(c2:Coord):boolean{
    return this.x === c2.x && this.y === c2.y;
  }
}
export class HexCoord{
  x:number;
  y:number;
  z:number;
  constructor(x:number, y:number, z:number){
    this.x = x;
    this.y = y;
    this.z = z;
  }
  toCoord(size:number):Coord{
    const x = this.x;
    const y = this.y;
    const z = this.z;
    return new Coord(
      size / 2 * r3 * (x + z + 2 * y),
      3 * size / 2 * (z - x)
    )
  }
  toString():string{
    return `${this.x}, ${this.y}, ${this.z}`
  }
  add(c:HexCoord):HexCoord{
    return new HexCoord(
      this.x + c.x,
      this.y + c.y,
      this.z + c.z
    )
  }
  sub(c:HexCoord):HexCoord{
    return new HexCoord(
      this.x - c.x,
      this.y - c.y,
      this.z - c.z
    )
  }
  scale(s:number):HexCoord{
    return new HexCoord(
      this.x * s,
      this.y * s,
      this.z * s
    )
  }
  eq(c:HexCoord):boolean{
    return c.x + c.y === this.x + this.y && 
           c.z + c.y === this.z + this.y
  }
  taxi_dist(c:HexCoord){
    const sub = this.sub(c);
    return Math.max(
        Math.abs(sub.x - sub.z),
        Math.abs(sub.y + sub.z),
        Math.abs(sub.x + sub.y)
      );
  }
  round(){
    let x = Math.floor(this.x);
    let y = Math.floor(this.y);
    let z = Math.floor(this.z);
    for (let i = 0; i <= 1; i++){
      for (let j = 0; j <= 1; j++){
        for (let k = 0; k <= 1; k++){
          const dx = x + i - this.x;
          const dy = y + j - this.y;
          const dz = z + k - this.z;
          
          if (Math.abs(dx+2*dy+dz)>1) continue;
          if (Math.abs(dy+2*dz-dx)>1) continue;
          if (Math.abs(dy+2*dx-dz)>1) continue;
          
          return new HexCoord(x+i,y+j,z+k)
        }
      }
    }
  }
}