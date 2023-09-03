
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
