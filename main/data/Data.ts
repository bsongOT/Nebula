export * from "./components/Content"
export * from "./components/Nebula"

import { Tree } from "@/data-structure/tree"
import { Coord, HexCoord } from "../../engine/utils/math/coord-system"
import {Content} from "./components/Content"
import { DataCollection } from "./DataCollection"
import { Dust } from "./components/Dust"
import {Nebula} from "./components/Nebula"
import {Universe} from "./components/Universe"
import {Relation} from "./components/Relation"
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
export const $$ = (name:DataKey, value:string) => localStorage.setItem(name, value)
export class Data {
  public contents!:DataCollection<Content>;
  public nebulas!:DataCollection<Nebula>;
  public universes!:DataCollection<Universe>;
  public relations!:DataCollection<Relation>;
  public dusts!:DataCollection<Dust>;

  public load(){
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
    if (univ.nebulaInfos.length === 0)
      return new Coord(0, 0)

    const worldPoses = univ.nebulaInfos.map(ni => ni.worldPos)
    const xs = worldPoses.map(p => p.x)
    const ys = worldPoses.map(p => p.y)

    const [minx, maxx] = [Math.min(...xs), Math.max(...xs)]
    const [miny, maxy] = [Math.min(...ys), Math.max(...ys)]

    const width = maxx - minx + 1;
    const height = maxy - miny + 1;

    const isFull = worldPoses.length + 1 > width * height

    if (isFull){
      if (width <= height) 
        return new Coord(maxx + 1, miny)
      else
        return new Coord(minx, maxy + 1)
    }

    if (width > height){
      const wallYs = worldPoses.filter(p => p.x === maxx).map(p => p.y)
      const wallHighestY = Math.min(...[...Array(height).keys()].map(k => k + miny).filter(y => !wallYs.includes(y)))
      return new Coord(maxx, wallHighestY)
    }

    const bottomXs = worldPoses.filter(p => p.y === maxy).map(p => p.x)
    const bottomLeftmostX = Math.min(...[...Array(width).keys()].map(k => k + minx).filter(x => !bottomXs.includes(x)))
    return new Coord(bottomLeftmostX, maxy)
  }
}

export const data = new Data()
data.load();