import { Coord, H, HexCoord, P } from "@/utils/math/coord-system";
import { Content } from "./components/Content";
import { Dust } from "./components/Dust";
import { Nebula, QueryNebula } from "./components/Nebula";
import { Relation } from "./components/Relation";
import { NebulaLocation, Universe } from "./components/Universe";
import { Tree } from "@/data-structure/tree";
import { DataCollection } from "./DataCollection";
import { DayNebula, LifetimeNebula } from "./Data";

type KeyOmitFunction<T> =   { 
  [K in keyof T]: T[K] extends Function ? never : K 
}[keyof T]
type OmitFunction<T> = {
  [K in KeyOmitFunction<T>]: T[K]
}
type Anyify<T> = {
  [K in keyof T]: any
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
    return {
      id: nebula.id,
      name: nebula.name,
      tree: nebula.tree.map(n => n.id).arrayize(),
      palette: nebula.palette.map(n => n.id),
    } satisfies {[key in keyof Nebula]: any}
  }
  static universe(universe:Universe){
    return {
      name: universe.name,
      id: universe.id,
      relations: universe.relations.map(r => r.id),
      nebulaLocations: universe.nebulaLocations.map(nl => ({
        start: {
          x: nl.start.x,
          y: nl.start.y,
          z: nl.start.z
        },
        worldPos: {
          x: nl.worldPos.x,
          y: nl.worldPos.y
        },
        nebula: nl.nebula.id,
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
    } satisfies Anyify<Relation>
  }
  static dayNebula(dayNebula:DayNebula){
    return {
      add: dayNebula.add.map(cd => ({
        content: cd.content.id,
        day: cd.day.getTime()
      })),
      modify: dayNebula.modify.map(cd => ({
        content: cd.content.id,
        day: cd.day.getTime()
      })),
      remove: dayNebula.remove.map(cd => ({
        content: cd.content.id,
        day: cd.day.getTime()
      })),
    } satisfies Anyify<DayNebula>
  }
  static lifetimeNebula(lifetimeNebula:LifetimeNebula){
    return {
      deads: lifetimeNebula.deads,
      modifieds: lifetimeNebula.modifieds.map(c => c.id),
      livings: lifetimeNebula.livings.map(c => c.id),
      news: lifetimeNebula.news.map(c => c.id)
    } satisfies Anyify<LifetimeNebula>
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
      return new Nebula({
        id: nebulaBox.id,
        name: nebulaBox.name,
        tree: Tree.treeize(nebulaBox.tree).map(id => contents.get(id)!),
        palette: nebulaBox.palette.map(id => contents.get(id)!).filter(c => c),
      } satisfies Nebula)
  }
  static universe(universeBox:ReturnType<typeof Packer.universe>, nebulas:DataCollection<Nebula>, relations:DataCollection<Relation>){
    return new Universe({
      id: universeBox.id,
      name: universeBox.name,
      nebulaLocations: universeBox.nebulaLocations.map(
        nl => ({
          nebula: nebulas.get(nl.nebula)!,
          start: H(nl.start.x, nl.start.y, nl.start.z),
          worldPos: P(nl.worldPos.x, nl.worldPos.y)
        })
      ),
      relations: universeBox.relations.map(id => relations.get(id)!)
    } satisfies Omit<OmitFunction<Universe>, "boxSize" | "range">)
  }
  static relation(relationBox:ReturnType<typeof Packer.relation>, nebulas:DataCollection<Nebula>, contents:DataCollection<Content>, dusts:DataCollection<Dust>){
    const mainTree = nebulas.get(relationBox.mainTree)!;
    const secondTree = nebulas.get(relationBox.secondTree)!;

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
  static dayNebula(dayNebulaBox:ReturnType<typeof Packer.dayNebula>, contents:DataCollection<Content>){
    return {
      add: dayNebulaBox.add.map(cd => ({
        content: contents.get(cd.content)!,
        day: new Date(cd.day)
      })),
      modify: dayNebulaBox.modify.map(cd => ({
        content: contents.get(cd.content)!,
        day: new Date(cd.day)
      })),
      remove: dayNebulaBox.remove.map(cd => ({
        content: contents.get(cd.content)!,
        day: new Date(cd.day)
      }))
    } satisfies DayNebula
  }
  static lifetimeNebula(lifetimeNebulaBox:ReturnType<typeof Packer.lifetimeNebula>, contents:DataCollection<Content>){
    return {
      deads: lifetimeNebulaBox.deads,
      modifieds: lifetimeNebulaBox.modifieds.map(id => contents.get(id)!),
      livings: lifetimeNebulaBox.livings.map(id => contents.get(id)!),
      news: lifetimeNebulaBox.news.map(id => contents.get(id)!)
    } satisfies LifetimeNebula
  }
}