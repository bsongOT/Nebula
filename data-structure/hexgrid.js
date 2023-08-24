import {emptyArr} from "../../utils/utils.js"

export class HexGrid{
  datas;
  size;
  constructor(size){
    this.size = size
    this.datas = emptyArr(2*size-1).map(v => emptyArr(2*size-1))
  }
  at(one, three, five){
    return this.datas[five+three]?.[one+three];
  }
  setVal(one, three, five, val){
    if (!this.datas[five+three]) return
    this.datas[five+three][one+three] = val;
  }
  min(one){
    if (one < this.size) return 0;
    else return one + 1 - this.size
  }
  max(one){
    if (one < this.size) return this.size + one;
    else return 2 * this.size - 1;
  }
}