import {Nebula} from "./Nebula"
import {HexCoord} from "../../engine/coord-system"
import { data } from "./Data";
import { DataComponent } from "./DataComponent";

export class Playground implements DataComponent{
  nebulaInfos:NebulaShape[];
  id: number;
  constructor(){
    this.nebulaInfos = []
  }
  public pack(){

  }
  public static load(obj:any){
    let p = new Playground();
    p.nebulaInfos = obj.nebulaInfos.map(n => {
      return new NebulaShape(
        data.nebulas.get(n.id),
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