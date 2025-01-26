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
}
export type NebulaLocation = {
  nebula:Nebula;
  start:HexCoord;
}