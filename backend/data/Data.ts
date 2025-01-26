export * from "./components/Content"
export * from "./components/Nebula"

import {Content} from "./components/Content"
import { DataCollection } from "./DataCollection"
import { Nebula } from "./components/Nebula"
import { Unpacker } from "./DataParser"
import { engine } from "@/engine"
import { DataTransporter } from "./DataTransporter"
import { SystemUniverse } from "./components/SystemUniverse"
import { Dust } from "./components/Dust"
import { TreeNode } from "@/data-structure/tree"

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

export class Notify {
  public readonly isolatedContents;
  public readonly isolatedNebulas;
  public readonly returnedRoutines;
  public readonly contentStates;
  public get length(){
    return (
      this.isolatedContents.length +
      this.isolatedNebulas.length +
      this.returnedRoutines.length
    );
  }
  constructor(private data:Data){
    this.isolatedContents = this.getIsolatedContents();
    this.isolatedNebulas = this.getIsolatedNebulas();
    this.returnedRoutines = this.getReturnedRoutines();
    this.contentStates = this.getContentStates();
  }
  private getIsolatedContents(){
    const nebulas = this.data.nebulas.all();

    return this.data.contents.filter(
      c => nebulas.every(
        n => !n.tree.nodes.map(n => n.data).includes(c)
      )
    )
  }
  private getIsolatedNebulas(){
    const univs = this.data.universes.all();

    return this.data.nebulas.filter(
      n => univs.every(
        u => !u.nebulaLocations.find(nl => nl.nebula === n)
      )
    )
  }
  private getReturnedRoutines(){
    const routines = this.data.routines;
    const dayNeb = this.data.systemNebulas.day;
    const today = new Date().getTime();
    const mspd = 1000 * 60 * 60 * 24; 

    return routines.filter(r => {
      const day = dayNeb.modify.find(i => i.content === r.content)?.day
      if (!day) return false;
      if ((day.getTime() - today) / mspd < r.cycle) return false;
      return true;
    });
  }
  private getContentStates(){

  }
}

export class Data {
  public readonly dusts;
  public readonly contents;
  public readonly nebulas;
  public readonly relations;
  public readonly universes;

  public readonly systemNebulas;
  public readonly systemUniverse;

  public readonly routines;
  public readonly notifications;

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
    this.routines = new Array<{
      content:Content,
      cycle:number
    }>()
    this.notifications = new Notify(this);
    this.systemUniverse = new SystemUniverse(this);

    engine.updater.register(() => DataTransporter.save(this))
  }

  public addContent(content:Content){
    this.contents.add(content)
    if (content.dusts.traverse().length === 0){
      content.dusts.insert(new TreeNode(this.dusts.add(new Dust())))
    }
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
    return nebula;
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
    return this.contents.map(c => ({
      count: this.nebulas.filter(
        n => n.tree.nodes.some(
          n => n.parent?.data === c
        )
      ).length,
      content: c
    }))
  }

  private getImportanceDust(){
    return this.contents.map(c => ({
      count: c.dusts.length,
      content: c,
    }))
  }
}