import {emptyArr} from "../utils/utils"
import {HexCoord} from "../utils/CoordConverter"

export class HexGrid<T>{
  datas:(T|undefined)[][];
  size:HexCoord;
  constructor(size:HexCoord){
    const [x, y, z] = [size.x, size.y, size.z]
    this.size = size
    this.datas = emptyArr(x+y-1)
                .map(v => emptyArr(y+z-1))
  }
  at(h:HexCoord):T|undefined{
    return this.datas[h.y+h.z]?.[h.x+h.y]
  }
  setVal(h:HexCoord, val:T){
    if (!this.datas[h.z+h.y]) return
    this.datas[h.z+h.y][h.x+h.y] = val;
  }
  next(h:HexCoord):HexCoord|undefined{
    const n = new HexCoord(h.x + 1, h.y, h.z);
    const s = this.size;
    if (n.x + n.y >= s.x + s.y - 1){
      //X = 0
      //Z = y+z+1
    }
  }
  get area():number{
    const [x, y, z] = [this.size.x, this.size.y, this.size.z]
    return x*(y-1) + y*(z-1) + z*(x-1) + 1
  }
}