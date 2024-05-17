import {range} from "../utils/utils"
import {Coord, H, HexCoord, P} from "../utils/math/coord-system"

export class Grid<T>{
  private $size;
  datas:(T|undefined)[][];

  public get size(){
    const s = this.$size;
    return P(s.x, s.y);
  }
  protected set size(v:Coord){
    this.$size = P(v.x, v.y)
  }
  constructor(size:Coord){
    const [x, y] = [size.x, size.y]
    this.$size = size
    this.datas = range(y).map(_ => range(x).map(_ => undefined));
  }
  at(c:Coord):T|undefined{
    return this.datas[c.y]?.[c.x]
  }
  setVal(c:Coord, val:T|undefined){
    if (!this.datas[c.y]) return
    if (!this.datas[c.y][c.x]) return
    this.datas[c.y][c.x] = val;
  }
  next(c:Coord){
    const s = this.size;

    if (c.x > s.x) {
        return P(0, c.y + 1);
    }
    
    return P(c.x + 1, c.y);
  }
  public map<U>(func:(element:T, position:Coord) => U){
    const n = new Grid<U>(this.size);
    let pos = P(0, 0);
    for (let i = 0; i < this.area; i++){
      n.setVal(pos, func(this.at(pos)!, pos))
      pos = this.next(pos);
    }
  }
  get area():number{
    const [x, y] = [this.size.x, this.size.y]
    return x * y;
  }
  get range(){
    const range = [];
    let pos = P(0, 0);
    for (let i = 0; i < this.area; i++){
      range.push(pos)
      pos = this.next(pos)
    }
    return range;
  }
}