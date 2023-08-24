export class Coord{
  x;
  y;
  constructor(x, y){
    this.x = x;
    this.y = y;
  }
  add(c2){
    return new Coord(
      this.x + c2.x, 
      this.y + c2.y
    )
  }
  sub(c2){
    return new Coord(
      this.x - c2.x,
      this.y - c2.y
    )
  }
  eq(c2){
    return this.x === c2.x && this.y === c2.y;
  }
}
export class HexCoord{
  one;
  three;
  five;
  constructor(one, three, five){
    this.one = one;
    this.three = three;
    this.five = five;
  }
  toCoord(size){
    const one = this.one;
    const three = this.three;
    const five = this.five;
    return new Coord(
      size / 2 * r3 * (one + five + 2 * three),
      3 * size / 2 * (five - one)
    )
  }
  toString(){
    return `${this.one}, ${this.three}, ${this.five}`
  }
  add(c){
    return new HexCoord(
      this.one + c.one,
      this.three + c.three,
      this.five + c.five
    )
  }
  sub(c){
    return new HexCoord(
      this.one - c.one,
      this.three - c.three,
      this.five - c.five
    )
  }
  scale(s){
    return new HexCoord(
      this.one * s,
      this.three * s,
      this.five * s
    )
  }
  eq(c){
    return c.one + c.three === this.one + this.three && c.five + c.three === this.five + this.three
  }
  taxi_dist(c){
    const sub = this.sub(c);
    return Math.max(
        Math.abs(sub.one - sub.five),
        Math.abs(sub.three + sub.five),
        Math.abs(sub.one + sub.three)
      );
  }
  round(){
    let x = Math.floor(this.one);
    let y = Math.floor(this.three);
    let z = Math.floor(this.five);
    for (let i = 0; i <= 1; i++){
      for (let j = 0; j <= 1; j++){
        for (let k = 0; k <= 1; k++){
          const dx = x + i - this.one;
          const dy = y + j - this.three;
          const dz = z + k - this.five;
          
          if (Math.abs(dx+2*dy+dz)>1) continue;
          if (Math.abs(dy+2*dz-dx)>1) continue;
          if (Math.abs(dy+2*dx-dz)>1) continue;
          
          return new HexCoord(x+i,y+j,z+k)
        }
      }
    }
  }
}