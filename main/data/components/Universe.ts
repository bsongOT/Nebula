import {Nebula} from "./Nebula"
import {Coord, HexCoord} from "../../../engine/coord-system"
import { Content, data } from "../Data";
import { DataComponent } from "./DataComponent";
import { Relation } from "./Relation";

export class Universe implements DataComponent{
  nebulaInfos:NebulaInfo[];
  relations:Relation[];
  palette:Content[];
  id: number;
  constructor(){
    this.nebulaInfos = []
    this.relations = []
    this.palette = []
    this.id = -1;
  }
  public isIn(x:number, y:number){
    return this.nebulaInfos.some(n => n.worldPos.eq(new Coord(x, y)))
  }
  public isInBoxRange(x:number, y:number){
    const xs = this.nebulaInfos.map(n => n.worldPos.x)
    const ys = this.nebulaInfos.map(n => n.worldPos.y)

    const [minx, maxx] = [Math.min(...xs), Math.max(...xs)]
    const [miny, maxy] = [Math.min(...ys), Math.max(...ys)]

    return (
      minx <= x && x <= maxx &&
      miny <= y && y <= maxy
    )
  }
}
export type NebulaInfo = {
  nebula:Nebula;
  start:HexCoord;
  worldPos:Coord;
}