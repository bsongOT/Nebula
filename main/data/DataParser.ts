import { Coord, HexCoord } from "@/coord-system";
import { Content } from "./components/Content";
import { Dust } from "./components/Dust";
import { Nebula } from "./components/Nebula";
import { Relation } from "./components/Relation";
import { NebulaInfo, Universe } from "./components/Universe";
import { data } from "./Data";
import { Tree } from "@/data-structure/tree";

type DustBox = {
    id: number
    claim:string,
    kernelPath: string
}
type ContentBox = {
    id:number,
    title:string,
    actor:string|undefined
}
type NebulaBox = {
    id:number,
    name:string,
    position: {x:number, y:number},
    treeOrder: {id:number, parent:number}[],
}
type UniverseBox = {
    id: number,
    nebulaInfos: {
        start: {x:number, y:number, z:number},
        worldPos: {x:number, y:number},
        nebula: number
    }[],
    relations: number[],
    palette: number[]
}
type RelationBox = {
    id: number,
    mainTree: number,
    secondTree: number,
    table: number[][]
}

export class Packer {
  static dust(dust:Dust){
    return {
        id: dust.id,
        claim: dust.claim,
        kernelPath: dust.kernelPath
    }
  }
  static content(content:Content){
    return {
        id: content.id,
        title: content.title,
        dusts: content.dusts.map(d => d.id),
        actor: content.actor
    }
  }
  static nebula(nebula:Nebula){
    return {
        id: nebula.id,
        name: nebula.name,
        treeOrder: nebula.tree.map(n => n.id).arrayize(),
        position: {
            x: nebula.position.x,
            y: nebula.position.y
        }
    }
  }
  static universe(universe:Universe){
    return {
        id: universe.id,
        palette: universe.palette.map(c => c.id),
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
    }
  }
  static relation(relation:Relation){
    return {
        id: relation.id,
        mainTree: relation.mainTree.id,
        secondTree: relation.secondTree.id,
        table: relation.table.map(r => (
            r.map(d => d instanceof Dust ? d.id : d)
        ))
    }
  }
}
export class Unpacker {
  static dust(dustBox:DustBox){
    const d = new Dust()
    
    d.claim = dustBox.claim
    d.kernelPath = dustBox.kernelPath
    d.id = dustBox.id
  }
  static content(contentBox:ContentBox){
    const c = new Content();
    
    c.title = contentBox.title
    c.id = contentBox.id
    if (contentBox.actor) c.actor = contentBox.actor
    
    return c;
  }
  static nebula(nebulaBox:NebulaBox){
    const n = new Nebula();
    
    n.name = nebulaBox.name
    n.id = nebulaBox.id
    n.position = new Coord(nebulaBox.position.x, nebulaBox.position.y)
    n.tree = Tree.treeize(nebulaBox.treeOrder.map(i => ({
      data: data.contents.get(i.id)!,
      parent: i.parent
    })))

    return n;
  }
  static universe(universeBox:UniverseBox){
    const u = new Universe()

    u.id = universeBox.id;
    u.nebulaInfos = universeBox.nebulaInfos.map(
        ni => ({
          nebula: data.nebulas.get(ni.nebula)!,
          start: new HexCoord(ni.start.x, ni.start.y, ni.start.z),
          worldPos: new Coord(ni.worldPos.x, ni.worldPos.y)
        })
    )
    u.palette = universeBox.palette.map(id => data.contents.get(id)!);
    u.relations = universeBox.relations.map(id => data.relations.get(id)!)

    return u;
  }
  static relation(relationBox:RelationBox){
    const r = new Relation();
        
    r.mainTree = data.nebulas.get(relationBox.mainTree)!
    r.secondTree = data.nebulas.get(relationBox.secondTree)!
    r.id = relationBox.id
    r.table = relationBox.table.map(
        row => row.map(
            id => data.dusts.get(id) ?? "none"
        )
    )
    
    return r;
  }
}
export class Exporter {
  
}
export class Importer {

}