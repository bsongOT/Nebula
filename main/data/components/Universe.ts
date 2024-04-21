import {Nebula} from "./Nebula"
import {Coord, HexCoord, P} from "../../../engine/utils/math/coord-system"
import { Content, data } from "../Data";
import { DataComponent } from "./DataComponent";
import { Relation } from "./Relation";

export class Universe implements DataComponent{
  nebulaInfos:NebulaInfo[];
  relations:Relation[];
  id: number;
  constructor(){
    this.nebulaInfos = []
    this.relations = []
    this.id = -1;
  }
  public get range(){
    const poses = this.nebulaInfos.map(n => n.worldPos)
    const xs = poses.map(p => p.x);
    const ys = poses.map(p => p.y);

    const [minx, maxx] = [Math.min(...xs), Math.max(...xs)]
    const [miny, maxy] = [Math.min(...ys), Math.max(...ys)]

    return [
      {min: minx, max: maxx},
      {min: miny, max: maxy}
    ]
  }
  public get boxSize(){
    const range = this.range;
    return [
      range[0].max - range[0].min + 1,
      range[1].max - range[1].min + 1
    ]
  }
  public isIn(x:number, y:number){
    return this.nebulaInfos.some(n => n.worldPos.eq(P(x, y)))
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