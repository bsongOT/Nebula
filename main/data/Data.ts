export * from "./components/Content"
export * from "./components/Nebula"

import { Coord, H, HexCoord, P } from "../../engine/utils/math/coord-system"
import {Content} from "./components/Content"
import { DataCollection } from "./DataCollection"
import {CategoryNebula, CommonNebula, Nebula, QueryNebula} from "./components/Nebula"
import {Universe} from "./components/Universe"
import { Unpacker } from "./DataParser"
import { engine } from "@/engine"
import { DataTransporter } from "./DataTransporter"

type AddingContentOption = {
  nebula: CommonNebula,
  day?: Date
}
type AddingNebulaOption = {
  universe: Universe,
  position: Coord,
  start?: HexCoord
}

export type DayNebula = {
  add: {content:Content, day:Date}[],
  modify: {content:Content, day:Date}[],
  remove: {content:Content, day:Date}[]
}

export type LifetimeNebula = {
  deads: string[],
  modifieds: Content[],
  livings: Content[],
  news: Content[]
}

export class Data {
  public readonly dusts;
  public readonly contents;
  public readonly nebulas;
  public readonly relations;
  public readonly universes;

  public readonly systemNebulas;

  public constructor(){
    const wildDusts = DataTransporter.loadWildDataCollection("all-dusts")
    const wildContents = DataTransporter.loadWildDataCollection("all-contents")
    const wildNebulas = DataTransporter.loadWildDataCollection("all-nebulas")
    const wildUniverses = DataTransporter.loadWildDataCollection("all-universes")
    const wildRelations = DataTransporter.loadWildDataCollection("all-relations")

    console.log(wildContents)

    this.dusts = new DataCollection(wildDusts.map(d => Unpacker.dust(d)))
    this.contents = new DataCollection(wildContents.map(c => Unpacker.content(c, this.dusts)))
    this.nebulas = new DataCollection<Nebula>(wildNebulas.map(n => Unpacker.nebula(n, this.contents, this.dusts)))
    this.relations = new DataCollection(wildRelations.map(r => Unpacker.relation(r, this.nebulas, this.contents, this.dusts)))
    this.universes = new DataCollection(wildUniverses.map(u => Unpacker.universe(u, this.nebulas, this.relations)))

    for (const n of this.nebulas.all()){
      if (n instanceof CommonNebula){
        for (let i = 0; i < n.importers.length; i++){
          n.importers[i] = this.nebulas.get(n.importers[i].id)!
        }
      }
      if (n instanceof QueryNebula){
        for (const q of n.query){
          q.nebula = this.nebulas.get(q.nebula.id)!;
        }
      }
      if (n instanceof CategoryNebula){
        const neb = this.nebulas.get(n.referenceNebula.id);
        if (!(neb instanceof CommonNebula)) continue;
        n.referenceNebula = neb;
      }
    }

    this.systemNebulas = {
      isolated: this.getIsolated(),
      day: Unpacker.dayNebula(DataTransporter.loadWildDayNebula(), this.contents),
      lifetime: Unpacker.lifetimeNebula(DataTransporter.loadWildLifetimeNebula(), this.contents),
      importance: {
        nebula: this.getImportanceNebula(),
        parent: this.getImportanceParent(),
        child: this.getImportanceChild(),
        dust: this.getImportanceDust()
      }
    }

    engine.updater.register(() => DataTransporter.save(this))
  }

  public addContent(content:Content, option:AddingContentOption){
    this.contents.add(content)
    this.systemNebulas.day.add.push({
      day: option.day ?? new Date(),
      content: content
    })
    this.systemNebulas.lifetime.news.push(content)
    option.nebula.palette.push(content)
    return content;
  }

  public removeContent(content:Content){
    const system = this.systemNebulas;
    const {news, livings, modifieds, deads} = system.lifetime;

    this.contents.remove(content.id)

    if (news.includes(content)) news.splice(news.indexOf(content), 1)
    if (livings.includes(content)) livings.splice(livings.indexOf(content), 1)
    if (modifieds.includes(content)) modifieds.splice(modifieds.indexOf(content), 1)

    deads.push(content.title)
    content.id = -1;
  }

  public addNebula(nebula:Nebula, option:AddingNebulaOption){
    this.nebulas.add(nebula);
    option.universe.nebulaLocations.push({
      nebula: nebula,
      worldPos: option.position,
      start: option.start ?? H(-1, 0, 0)
    })
  }

  public removeNebula(nebula:Nebula){
    this.nebulas.remove(nebula.id);
    for (const u of this.universes.all()){
      const index = u.nebulaLocations.findIndex(ni => ni.nebula === nebula)
      if (index < 0) continue;
      u.nebulaLocations.splice(index, 1);
    }
  }

  public findAddablePosition(univ:Universe){
    const universePoses = univ.nebulaLocations.map(ni => ni.worldPos);
    const universes = this.universes.all()

    return universePoses
      .map(
        upos => [
          P(1, 0), P(-1, 0), P(0, 1), P(0, -1)
        ]
        .map(p => upos.add(p))
        .filter(
          p => universes.every(u => !u.isIn(p.x, p.y)) 
               && p.x >= 0 && p.y >= 0
        )
      ).flat(1)
  }

  private getIsolated(){
    const nebulas = this.nebulas.all();

    return this.contents.filter(
      c => nebulas.every(
        n => !(n instanceof CommonNebula) || !n.palette.includes(c)
      )
    )
  }

  private getImportanceNebula(){
    const contents = this.contents.all();
    const nebulas = this.nebulas.all();

    return contents.map(c => ({
      count: nebulas.filter(n => n instanceof CommonNebula && n.palette.includes(c)).length,
      content: c
    }))
  }

  private getImportanceParent(){
    const contents = this.contents.all();
    const nebulas = this.nebulas.all();

    return contents.map(c => ({
      count: nebulas.filter(
        neb => neb instanceof CommonNebula && neb.tree.nodes.some(
          n => n.children.some(ch => ch.data === c)
       )
      ).length,
      content: c
    }))
  }

  private getImportanceChild(){
    const contents = this.contents.all();
    const nebulas = this.nebulas.all();

    return contents.map(c => ({
      count: nebulas.filter(
        n => n instanceof CommonNebula && n.tree.nodes.some(
          n => n.parent?.data === c
        )
      ).length,
      content: c
    }))
  }

  private getImportanceDust(){
    return this.contents.all().map(c => ({
      count: c.dusts.length,
      content: c,
    }))
  }
}