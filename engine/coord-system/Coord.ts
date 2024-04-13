export function P(x:number, y:number){
  return new Coord(x, y)
}
export class Coord{
  public x:number;
  public y:number;

  constructor(x:number, y:number){
    this.x = x;
    this.y = y;
  }
  public add(c2:Coord){
    return new Coord(
      this.x + c2.x, 
      this.y + c2.y
    )
  }
  public sub(c2:Coord){
    return new Coord(
      this.x - c2.x,
      this.y - c2.y
    )
  }
  public eq(c2:Coord):boolean{
    return this.x === c2.x && this.y === c2.y;
  }
  public scale(s:number){
    return new Coord(this.x * s, this.y * s)
  }
}
