export * from "./components/Content"
export * from "./components/Nebula"

import { Tree, TreeNode } from "@/data-structure/tree"
import { Coord, HexCoord } from "../../engine/coord-system"
import { nebulaSpaceSize } from "../consts"
import {Content} from "./components/Content"
import { DataCollection } from "./DataCollection"
import { Dust } from "./components/Dust"
import {Nebula} from "./components/Nebula"
import {NebulaInfo, Universe} from "./components/Universe"
import {Relation} from "./components/Relation"
import { DataComponent } from "./components/DataComponent"
import { Packer, Unpacker } from "./DataParser"

type DataKey = "all-dusts" | "all-contents" | "all-nebulas" | "all-universes" | "all-relations"
type DataMap = {
  "all-dusts": Dust,
  "all-contents": Content,
  "all-nebulas": Nebula,
  "all-universes": Universe,
  "all-relations": Relation
}

export const $ = (name:string) => localStorage.getItem(name)
export const $$ = (name:string, value:string) => localStorage.setItem(name, value)
export class Data {
  public readonly contents:DataCollection<Content>;
  public readonly nebulas:DataCollection<Nebula>;
  public readonly universes:DataCollection<Universe>;
  public readonly relations:DataCollection<Relation>;
  public readonly dusts:DataCollection<Dust>;
  
  constructor(){
    this.dusts = this.loadCollection("all-dusts")
    this.contents = this.loadCollection("all-contents")
    this.nebulas = this.loadCollection("all-nebulas")
    this.universes = this.loadCollection("all-universes")
    this.relations = this.loadCollection("all-relations")
  }
  
  public addContent(title:string){
    const content = this.contents.add(new Content())

    content.title = title;
    $$("all-contents", JSON.stringify(this.contents.map(c => Packer.content(c))))
    
    return content;
  }
  public addNebula(name:string, at:Universe){
    const nebula = this.nebulas.add(new Nebula())

    nebula.name = name;
    nebula.tree = new Tree<Content>()
    
    at.nebulaInfos.push({
      nebula: nebula,
      start: new HexCoord(-1, 0, 0),
      worldPos: this.findPos(at)
    })

    $$("all-nebulas", JSON.stringify(this.nebulas.map(n => Packer.nebula(n))))
    $$("all-universes", JSON.stringify(this.universes.map(u => Packer.universe(u))))
    
    return nebula;
  }
  public addUniverse(){
    const universe = this.universes.add(new Universe());

    $$("all-universes", JSON.stringify(this.universes.map(u => Packer.universe(u))))

    return universe
  }

  private loadCollection<T extends DataKey>(keyword:T):DataCollection<DataMap[T]>{
    const json = JSON.parse($(keyword) ?? "[]");
    const boxes = Array.from(json) as any[];
    const loader = {
      "all-dusts": Unpacker.dust,
      "all-contents": Unpacker.content,
      "all-nebulas": Unpacker.nebula,
      "all-universes": Unpacker.universe,
      "all-relations": Unpacker.relation
    }[keyword] as ((box:any) => DataMap[T])

    return new DataCollection(boxes.map(loader))
  }

  private findPos(univ:Universe):Coord{
    let maxx = Math.max(...univ.nebulaInfos.map(n => n.worldPos.x));
    if (maxx < 0) maxx = 0;
    let maxy = Math.max(...univ.nebulaInfos.filter(n => n.worldPos.x === maxx).map(n => n.worldPos.y));
    if (maxy < 0) maxy = 0;
    if (maxy < nebulaSpaceSize - 2)
      return new Coord(maxx, maxy + 2)
    else
      return new Coord(maxx + 2, 0)
  }
  public getNebulaSpaceTotalPage(){
    const total = Math.ceil(Math.max(...this.nebulas.map(n => n.position.x)) / nebulaSpaceSize);
    if (total < 0) return 1;
    return total + 1;
  }
}

export const data = new Data()