import { Coord, HexCoord } from "@/utils/math/coord-system";
import { Content } from "./components/Content";
import { Dust } from "./components/Dust";
import { Nebula } from "./components/Nebula";
import { Relation } from "./components/Relation";
import { NebulaInfo, Universe } from "./components/Universe";
import { Tree } from "@/data-structure/tree";
import { DataCollection } from "./DataCollection";

type DustBox = {
  id: number,
  claim: string,
  kernelPath: string
}
type ContentBox = {
  id:number,
  title:string,
  actor:string|undefined,
  dusts:{
    parent:number,
    data: number
  }[]
}
type NebulaBox = {
    id:number,
    name:string,
    treeOrder: {data:number, parent:number}[],
    palette: number[],
    importerIds: number[]
}
type UniverseBox = {
    id: number,
    name: string,
    nebulaInfos: {
        start: {x:number, y:number, z:number},
        worldPos: {x:number, y:number},
        nebula: number
    }[],
    relations: number[]
}
type RelationBox = {
    id: number,
    mainTree: number,
    secondTree: number,
    table: {
      main: number,
      second: number,
      state: number
    }[]
}

type KeyOmitFunction<T> =   { 
  [K in keyof T]: T[K] extends Function ? never : K 
}[keyof T]
type OmitFunction<T> = {
  [K in KeyOmitFunction<T>]: any
}

export class Packer {
  static dust(dust:Dust):DustBox{
    return {
      id: dust.id,
      claim: dust.claim,
      kernelPath: dust.kernelPath
    } satisfies {[key in keyof Dust]: any}
  }
  static content(content:Content):ContentBox{
    return {
      id: content.id,
      title: content.title,
      dusts: content.dusts.map(d => d.id).arrayize(),
      actor: content.actor
    } satisfies {[key in keyof Content]: any}
  }
  static nebula(nebula:Nebula):NebulaBox{
    return {
      id: nebula.id,
      name: nebula.name,
      treeOrder: nebula.tree.map(n => n.id).arrayize(),
      palette: nebula.palette.map(n => n.id),
      importerIds: nebula.importerIds
    } satisfies {[key in keyof Nebula]: any}
  }
  static universe(universe:Universe):UniverseBox{
    return {
      name: universe.name,
      id: universe.id,
      relations: universe.relations.map(r => r.id),
      nebulaInfos: universe.nebulaInfos.map(ni => ({
        start: {
          x: ni.start.x,
          y: ni.start.y,
          z: ni.start.z
        },
        worldPos: {
          x: ni.worldPos.x,
          y: ni.worldPos.y
        },
        nebula: ni.nebula.id,
      }))
    } satisfies Omit<OmitFunction<Universe>, "boxSize" | "range">
  }
  static relation(relation:Relation):RelationBox{
    return {
        id: relation.id,
        mainTree: relation.mainTree.id,
        secondTree: relation.secondTree.id,
        table: relation.table.map(c => ({
          main: c.main.id,
          second: c.second.id,
          state: c.state instanceof Dust ? c.state.id : c.state
        }))
    } satisfies {[key in keyof Relation]: any}
  }
}
export class Unpacker {
  static dust(dustBox:DustBox){
    return new Dust(dustBox);
  }
  static content(contentBox:ContentBox, dusts:DataCollection<Dust>){
    const c = new Content(contentBox);
    
    c.dusts = Tree.treeize(contentBox.dusts).map(id => dusts.get(id)!)

    return c;
  }
  static nebula(nebulaBox:NebulaBox, contents:DataCollection<Content>){
    const n = new Nebula();
    
    n.name = nebulaBox.name
    n.id = nebulaBox.id
    n.tree = Tree.treeize(nebulaBox.treeOrder).map(id => contents.get(id)!)
    n.palette = nebulaBox.palette.map(id => contents.get(id)!).filter(c => c)
    n.importerIds = nebulaBox.importerIds;

    return n;
  }
  static universe(universeBox:UniverseBox, nebulas:DataCollection<Nebula>, relations:DataCollection<Relation>){
    const u = new Universe()

    u.name = universeBox.name;
    u.id = universeBox.id;
    u.nebulaInfos = universeBox.nebulaInfos.map(
        ni => ({
          nebula: nebulas.get(ni.nebula)!,
          start: new HexCoord(ni.start.x, ni.start.y, ni.start.z),
          worldPos: new Coord(ni.worldPos.x, ni.worldPos.y)
        })
    )
    u.relations = universeBox.relations.map(id => relations.get(id)!)

    return u;
  }
  static relation(relationBox:RelationBox, nebulas:DataCollection<Nebula>, contents:DataCollection<Content>, dusts:DataCollection<Dust>){
    const r = new Relation();
        
    r.mainTree = nebulas.get(relationBox.mainTree)!
    r.secondTree = nebulas.get(relationBox.secondTree)!
    r.id = relationBox.id
    r.table = relationBox.table.map(c => ({
      main: contents.get(c.main)!,
      second: contents.get(c.second)!,
      state: dusts.get(c.state) ?? c.state
    })).filter(td => td.main && td.second && td.state)
    
    return r;
  }
}
export class Exporter {
  
}
export class Importer {

}