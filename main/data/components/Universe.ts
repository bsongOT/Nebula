import {Nebula} from "./Nebula"
import {Coord, HexCoord, P} from "../../../engine/utils/math/coord-system"
import { DataComponent } from "./DataComponent";
import { Relation } from "./Relation";

export class Universe implements DataComponent{
  name: string;
  nebulaLocations:NebulaLocation[];
  relations:Relation[];
  id: number;
  
  constructor(info?: Partial<Universe>){
    this.name = info?.name ?? "Unnamed";
    this.nebulaLocations = info?.nebulaLocations ?? []
    this.relations = info?.relations ?? []
    this.id = info?.id ?? -1;
  }
  public get range(){
    const poses = this.nebulaLocations.map(n => n.worldPos)
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
    return this.nebulaLocations.some(n => n.worldPos.eq(P(x, y)))
  }
  public isInBoxRange(x:number, y:number){
    const xs = this.nebulaLocations.map(n => n.worldPos.x)
    const ys = this.nebulaLocations.map(n => n.worldPos.y)

    const [minx, maxx] = [Math.min(...xs), Math.max(...xs)]
    const [miny, maxy] = [Math.min(...ys), Math.max(...ys)]

    return (
      minx <= x && x <= maxx &&
      miny <= y && y <= maxy
    )
  }
  public get(pos:Coord){
    return this.nebulaLocations.find(nl => nl.worldPos.eq(pos))?.nebula;
  }
}
export type NebulaLocation = {
  nebula:Nebula;
  start:HexCoord;
  worldPos:Coord;
}