import {emptyArr} from "../utils/utils"
import {H, HexCoord} from "../utils/math/coord-system"

export class HexGrid<T>{
  private $size:HexCoord
  datas:(T|undefined)[][];
  public get size():HexCoord{
    const s = this.$size;
    return new HexCoord(s.x, s.y, s.z)
  }
  protected set size(v:HexCoord){
    this.$size = new HexCoord(v.x, v.y, v.z)
  }
  constructor(size:HexCoord){
    const [x, y, z] = [size.x, size.y, size.z]
    this.$size = size
    this.datas = emptyArr(x+y-1)
                .map(v => emptyArr(y+z-1))
  }
  at(h:HexCoord):T|undefined{
    return this.datas[h.y+h.z]?.[h.x+h.y]
  }
  setVal(h:HexCoord, val:T|undefined){
    if (!this.datas[h.z+h.y]) return
    if (this.datas[h.z+h.y].length <= h.x+h.y) return
    this.datas[h.z+h.y][h.x+h.y] = val;
  }
  next(h:HexCoord):HexCoord{
    const s = this.size;
    const isOut = (c:HexCoord) => 
      c.x + c.y > s.x + s.y - 2 ||
      c.x + c.y < 0 ||
      c.z - c.x < 1 - s.x ||
      c.z - c.x > s.z - 1;

    let n = h.add(new HexCoord(1, 0, 0));
    
    if (isOut(n))
      n = new HexCoord(0, 0, n.y + n.z + 1)
    if (isOut(n))
      n = new HexCoord(1 - s.z, n.z, 0)
    
    return n;
  }
  get area():number{
    const [x, y, z] = [this.size.x, this.size.y, this.size.z]
    return x*(y-1) + y*(z-1) + z*(x-1) + 1
  }
  get range(){
    const range = [];
    let pos = H(0, 0, 0);
    for (let i = 0; i < this.area; i++){
      range.push(pos)
      pos = this.next(pos)
    }
    return range;
  }
}