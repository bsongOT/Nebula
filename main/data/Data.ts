export * from "./components/Content"
export * from "./components/Nebula"

import { Coord, H, HexCoord, P } from "../../engine/utils/math/coord-system"
import {Content} from "./components/Content"
import { DataCollection } from "./DataCollection"
import { Nebula, QueryNebula } from "./components/Nebula"
import {Universe} from "./components/Universe"
import { Unpacker } from "./DataParser"
import { engine } from "@/engine"
import { DataTransporter } from "./DataTransporter"
import { SystemNebulaProvider } from "./SystemNebulaProvider"

type AddingContentOption = {
  nebula?: Nebula,
  day?: Date
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

  public get systemUniverse(){
    const univ = new Universe({name: "system"});
    const provider = new SystemNebulaProvider();
    univ.nebulaLocations.push(
      {
        nebula: provider.dayNebula(1),
        start: H(14, 0, 0),
        pathIndex: 0
      },{
        nebula: provider.isolatedNebula(),
        start: H(12, 0, 2),
        pathIndex: 0
      },{
        nebula: provider.importanceNebula(1),
        start: H(11, 0, 3),
        pathIndex: 0
      },{
        nebula: provider.mentionNebula(),
        start: H(9, 0, 5),
        pathIndex: 0
      }
    )
    return univ;
  }
  public get independentUniverse(){
    const univ = new Universe({name: "independent"})

    univ.nebulaLocations.push(
      ...this.nebulas.filter(neb => 
                        this.universes.all()
                        .every(u => !u.nebulaLocations.find(nl => nl.nebula === neb))
                      )
                      .map(neb => ({
                        nebula: neb,
                        start: H(-1, 0, 0),
                        pathIndex: 0
                      }))
    )

    return univ;
  }

  public constructor(){
    const wildDusts = DataTransporter.loadWildDataCollection("all-dusts")
    const wildContents = DataTransporter.loadWildDataCollection("all-contents")
    const wildNebulas = DataTransporter.loadWildDataCollection("all-nebulas")
    const wildUniverses = DataTransporter.loadWildDataCollection("all-universes")
    const wildRelations = DataTransporter.loadWildDataCollection("all-relations")

    this.dusts = new DataCollection(wildDusts.map(d => Unpacker.dust(d)))
    this.contents = new DataCollection(wildContents.map(c => Unpacker.content(c, this.dusts)))
    this.nebulas = new DataCollection<Nebula>(wildNebulas.map(n => Unpacker.nebula(n, this.contents, this.dusts)))
    this.relations = new DataCollection(wildRelations.map(r => Unpacker.relation(r, this.nebulas, this.contents, this.dusts)))
    this.universes = new DataCollection(wildUniverses.map(u => Unpacker.universe(u, this.nebulas, this.relations)))

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

  public addContent(content:Content){
    this.contents.add(content)
    const day = new Date()
    day.setHours(0, 0, 0, 0);
    this.systemNebulas.day.add.push({
      day: day,
      content: content
    })
    this.systemNebulas.lifetime.news.push(content)
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

  public addNebula(nebula:Nebula){
    this.nebulas.add(nebula);
  }

  public removeNebula(nebula:Nebula){
    this.nebulas.remove(nebula.id);
    for (const u of this.universes.all()){
      const index = u.nebulaLocations.findIndex(ni => ni.nebula === nebula)
      if (index < 0) continue;
      u.nebulaLocations.splice(index, 1);
    }
  }

  private getIsolated(){
    const nebulas = this.nebulas.all();

    return this.contents.filter(
      c => nebulas.every(
        n => !n.tree.nodes.map(n => n.data).includes(c)
      )
    )
  }

  private getImportanceNebula(){
    const contents = this.contents.all();
    const nebulas = this.nebulas.all();

    return contents.map(c => ({
      count: nebulas.filter(n => n.tree.nodes.map(n => n.data).includes(c)).length,
      content: c
    }))
  }

  private getImportanceParent(){
    const contents = this.contents.all();
    const nebulas = this.nebulas.all();

    return contents.map(c => ({
      count: nebulas.filter(
        neb => neb.tree.nodes.filter(n => n !== neb.tree.root).some(
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
        n => n.tree.nodes.some(
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