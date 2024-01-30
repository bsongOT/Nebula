import {Nebula} from "./Nebula"
import {HexCoord} from "../../engine/coord-system"
import { data } from "./Data";
import { DataComponent } from "./DataComponent";

export class Playground implements DataComponent{
  nebulaInfos:NebulaShape[];
  id: number;
  constructor(id:number){
    this.nebulaInfos = []
    this.id = id;
  }
  public pack(){

  }
  public static load(obj:{
    id: number,
    nebulaInfos: {id: number, start:{x:number, y:number, z:number}}[]
  }){
    let p = new Playground(obj.id);
    p.nebulaInfos = obj.nebulaInfos.map(n => {
      return new NebulaShape(
        data.nebulas.get(n.id)!,
        new HexCoord(n.start.x, n.start.y, n.start.z)
      )
    })
    return p;
  }
}
export class NebulaShape{
  nebula:Nebula;
  start:HexCoord;
  constructor(nebula:Nebula, start:HexCoord){
    this.nebula = nebula;
    this.start = start;
  }
}