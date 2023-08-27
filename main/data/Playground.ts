import {Nebula} from "./Nebula"
import {HexCoord} from "../../engine/utils/CoordConverter"

export class Playground {
  nebulaInfos:NebulaInfo[];
  constructor(){
    this.nebulaInfos = []
  }
}
export class NebulaInfo{
  nebula:Nebula;
  start:HexCoord;
  constructor(nebula:Nebula, start:HexCoord){
    this.nebula = nebula;
    this.start = start;
  }
}