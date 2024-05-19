import { Coord, H, HexCoord, P } from "@/utils/math/coord-system";
import { Content } from "./components/Content";
import { Dust } from "./components/Dust";
import { CategoryNebula, CommonNebula, Nebula, QueryNebula } from "./components/Nebula";
import { Relation } from "./components/Relation";
import { NebulaInfo, Universe } from "./components/Universe";
import { Tree } from "@/data-structure/tree";
import { DataCollection } from "./DataCollection";

type KeyOmitFunction<T> =   { 
  [K in keyof T]: T[K] extends Function ? never : K 
}[keyof T]
type OmitFunction<T> = {
  [K in KeyOmitFunction<T>]: T[K]
}
type Anyify<T> = {
  [K in keyof T]: any
}
type NebulaTypeString = "common"|"query"|"category"|"unknown";

function getNebulaType(nebula:Nebula){
  if (nebula instanceof CommonNebula) return "common";
  if (nebula instanceof QueryNebula) return "query";
  if (nebula instanceof CategoryNebula) return "category";
  return "unknown"
}
function getNebula(type:NebulaTypeString, info:Partial<Nebula>){
  if (type === "common") return new CommonNebula(info);
  if (type === "query") return new QueryNebula(info);
  if (type === "category") return new CategoryNebula(info);
  return new CommonNebula(info)
}

export class Packer {
  static dust(dust:Dust){
    return {
      id: dust.id,
      claim: dust.claim,
      kernelPath: dust.kernelPath
    } satisfies {[key in keyof Dust]: any}
  }
  static content(content:Content){
    return {
      id: content.id,
      title: content.title,
      dusts: content.dusts.map(d => d.id).arrayize(),
      actor: content.actor
    } satisfies {[key in keyof Content]: any}
  }
  static nebula(nebula:Nebula){
    if (nebula instanceof CommonNebula){
      return {
        id: nebula.id,
        name: nebula.name,
        kind: "common" as "common",
        tree: nebula.tree.map(n => n.id).arrayize(),
        palette: nebula.palette.map(n => n.id),
        importerIds: nebula.importerIds
      } satisfies {[key in keyof CommonNebula]: any} & {kind: string}
    }
    if (nebula instanceof QueryNebula){
      return {
        id: nebula.id,
        name: nebula.name,
        kind: "query" as "query",
        query: nebula.query.map(q => ({nebula: q.nebula.id, nebulaType: getNebulaType(q.nebula) as NebulaTypeString, operator: q.operator}))
      } satisfies {[key in keyof QueryNebula]: any} & {kind: string}
    }
    if (nebula instanceof CategoryNebula){
      return {
        id: nebula.id,
        name: nebula.name,
        kind: "category" as "category",
        ownerMap: nebula.ownerMap.map(o => ({dust: o.dust.id, content: o.content.id})),
        referenceNebula: nebula.referenceNebula.id,
        referenceContent: nebula.referenceContent.id
      } satisfies Anyify<CategoryNebula> & {kind: string}
    }
    return {
      id: nebula.id,
      name: nebula.name,
      kind: "unknown" as "unknown"
    }
  }
  static universe(universe:Universe){
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
    } satisfies Omit<Anyify<OmitFunction<Universe>>, "boxSize" | "range">
  }
  static relation(relation:Relation){
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
  static dust(dustBox:ReturnType<typeof Packer.dust>){
    return new Dust(dustBox);
  }
  static content(contentBox:ReturnType<typeof Packer.content>, dusts:DataCollection<Dust>){
    return new Content({
      id: contentBox.id,
      title: contentBox.title,
      dusts: Tree.treeize(contentBox.dusts).map(id => dusts.get(id)!),
      actor: contentBox.actor
    } satisfies Content);
  }
  static nebula(nebulaBox:ReturnType<typeof Packer.nebula>, contents:DataCollection<Content>, dusts:DataCollection<Dust>){
    if (nebulaBox.kind === "common"){
      return new CommonNebula({
        id: nebulaBox.id,
        name: nebulaBox.name,
        tree: Tree.treeize(nebulaBox.tree).map(id => contents.get(id)!),
        palette: nebulaBox.palette.map(id => contents.get(id)!).filter(c => c),
        importerIds: nebulaBox.importerIds
      } satisfies CommonNebula)
    }
    if (nebulaBox.kind === "category"){
      return new CategoryNebula({
        id: nebulaBox.id,
        name: nebulaBox.name,
        referenceContent: contents.get(nebulaBox.referenceContent)!,
        referenceNebula: new CommonNebula({id: nebulaBox.referenceNebula}),
        ownerMap: nebulaBox.ownerMap.map(o => ({dust: dusts.get(o.dust)!, content: contents.get(o.content)!}))
      } satisfies CategoryNebula)
    }
    if (nebulaBox.kind === "query"){
      return new QueryNebula({
        id: nebulaBox.id,
        name: nebulaBox.name,
        query: nebulaBox.query.map(q => ({
          nebula: getNebula(q.nebulaType, {id: q.nebula}),
          operator: q.operator
        }))
      } satisfies QueryNebula)
    }
    return new CommonNebula(nebulaBox)
  }
  static universe(universeBox:ReturnType<typeof Packer.universe>, nebulas:DataCollection<Nebula>, relations:DataCollection<Relation>){
    return new Universe({
      id: universeBox.id,
      name: universeBox.name,
      nebulaInfos: universeBox.nebulaInfos.map(
        ni => ({
          nebula: nebulas.get(ni.nebula)!,
          start: H(ni.start.x, ni.start.y, ni.start.z),
          worldPos: P(ni.worldPos.x, ni.worldPos.y)
        })
      ),
      relations: universeBox.relations.map(id => relations.get(id)!)
    } satisfies Omit<OmitFunction<Universe>, "boxSize" | "range">)
  }
  static relation(relationBox:ReturnType<typeof Packer.relation>, nebulas:DataCollection<Nebula>, contents:DataCollection<Content>, dusts:DataCollection<Dust>){
    const mainTree = nebulas.get(relationBox.mainTree)!;
    const secondTree = nebulas.get(relationBox.secondTree)!;

    if (!(mainTree instanceof CommonNebula)) throw "Only common nebula is allowed as main tree";
    if (!(secondTree instanceof CommonNebula)) throw "Only common nebula is allowed as second tree";

    return new Relation({
      id: relationBox.id,
      mainTree: mainTree,
      secondTree: secondTree,
      table: relationBox.table.map(c => ({
        main: contents.get(c.main)!,
        second: contents.get(c.second)!,
        state: dusts.get(c.state) ?? c.state
      })).filter(td => td.main && td.second && td.state)
    } satisfies Relation);    
  }
}