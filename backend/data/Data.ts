export * from "./components/Content"
export * from "./components/Nebula"

import {Content} from "./components/Content"
import { Nebula } from "./components/Nebula"
import { engine } from "@/engine"
import { SystemUniverse } from "./components/SystemUniverse"
import { Dust } from "./components/Dust"
import { TreeNode } from "@/data-structure/tree"
import { DataLoader, DataSaver } from "./DataLoader"
import { Universe } from "./components/Universe"

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
    engine.updater.register(() => {
      this.isolatedContents.splice(0, this.isolatedContents.length);
      this.isolatedContents.push(...this.getIsolatedContents());

      this.isolatedNebulas.splice(0, this.isolatedNebulas.length);
      this.isolatedNebulas.push(...this.getIsolatedNebulas());

      this.returnedRoutines.splice(0, this.returnedRoutines.length);
      this.returnedRoutines.push(...this.getReturnedRoutines());
    })
  }
  private getIsolatedContents(){
    const nebulas = this.data.nebulas.all();

    return (
      this.data.contents.filter(
        c => nebulas.length === 0 || nebulas.every(
          n => !n.tree.traverse().map(i => i.node.data).includes(c)
        )
      )
    )
  }
  private getIsolatedNebulas(){
    const univs = this.data.universes.all();

    return this.data.nebulas.filter(
      n => univs.every(
        u => !u.nebulas.includes(n)
      )
    )
  }
  private getReturnedRoutines(){
    const routines = this.data.routines;
    const dayNeb = this.data.systemUniverse.dayNebula;
    const today = new Date().getTime();
    const mspd = 1000 * 60 * 60 * 24; 

    return routines.filter(r => {
      const node = dayNeb.tree.traverse().find(i => i.node.data === r.content)?.node;
      if (!node) return false;
      const year = Number(node.parent?.parent?.parent?.parent?.data.title.slice(0, -1) ?? 0);
      const month = Number(node.parent?.parent?.parent?.data.title.slice(0, -1) ?? 0);
      const date = Number(node.parent?.parent?.data.title.slice(0, -1) ?? 0);
      const day = new Date(year, month - 1, date);
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

  public readonly systemUniverse;
  public readonly isolatedUniverse;

  public readonly routines;
  public readonly notifications;
  public readonly fileAliases;

  public static async create(){
    const loadedData = await DataLoader.load();
    return new Data(loadedData)
  }
  private constructor(loadedData:Awaited<ReturnType<typeof DataLoader.load>>){
    this.dusts = loadedData.dusts;
    this.contents = loadedData.contents;
    this.nebulas = loadedData.nebulas;
    this.relations = loadedData.relations;
    this.universes = loadedData.universes;

    this.routines = new Array<{
      content:Content,
      cycle:number
    }>()
    this.systemUniverse = new SystemUniverse(this, loadedData);
    this.isolatedUniverse = new Universe({id: -1, name: "무소속 네뷸라"});
    this.notifications = new Notify(this);
    this.fileAliases = loadedData.fileAliases;

    DataSaver.saveContentsExport(this.contents);
    DataSaver.saveNebulasExport(this.nebulas);

    let saveCompleted = true;
    engine.updater.register(() => {
      if (!saveCompleted) return;
      saveCompleted = false;
      DataSaver.save(this).then(() => saveCompleted = true);
    });
    engine.updater.register(() => {
      const universes = this.universes.all();
      this.isolatedUniverse.nebulas = (
        this.nebulas.filter(n => universes.every(u => !u.nebulas.includes(n)))
      )
    })
  }

  public addContent(content:Content){
    this.contents.add(content)
    if (content.dusts.length === 0){
      content.dusts.insert(new TreeNode(this.dusts.add(new Dust())))
    }
    const day = new Date()
    const yearOfDay = day.getFullYear() + "년"
    const monthOfDay = day.getMonth() + 1 + "월"
    const dateOfDay = day.getDate() + "일"

    const dayNebula = this.systemUniverse.dayNebula;
    const yearNode = dayNebula.tree.root.children.find(n => n.data.title === yearOfDay) ?? dayNebula.tree.insert(new TreeNode(new Content({title: yearOfDay})));
    const monthNode = yearNode.children.find(n => n.data.title === monthOfDay) ?? dayNebula.tree.insert(new TreeNode(new Content({title: monthOfDay})), yearNode);
    const dayNode = monthNode.children.find(n => n.data.title === dateOfDay) ?? dayNebula.tree.insert(new TreeNode(new Content({title: dateOfDay})), monthNode);
    const addNode = dayNode.children.find(n => n.data.title === "추가") ?? dayNebula.tree.insert(new TreeNode(new Content({title: "추가"})), dayNode);
    
    dayNebula.tree.insert(new TreeNode(content), addNode);

    return content;
  }

  public registerModifiedContent(content:Content){
    const day = new Date()
    const yearOfDay = day.getFullYear() + "년"
    const monthOfDay = day.getMonth() + 1 + "월"
    const dateOfDay = day.getDate() + "일"

    const dayNebula = this.systemUniverse.dayNebula;
    const yearNode = dayNebula.tree.root.children.find(n => n.data.title === yearOfDay) ?? dayNebula.tree.insert(new TreeNode(new Content({title: yearOfDay})));
    const monthNode = yearNode.children.find(n => n.data.title === monthOfDay) ?? dayNebula.tree.insert(new TreeNode(new Content({title: monthOfDay})), yearNode);
    const dayNode = monthNode.children.find(n => n.data.title === dateOfDay) ?? dayNebula.tree.insert(new TreeNode(new Content({title: dateOfDay})), monthNode);
    const modifyNode = dayNode.children.find(n => n.data.title === "수정") ?? dayNebula.tree.insert(new TreeNode(new Content({title: "수정"})), dayNode);
    if (modifyNode.children.find(n => n.data === content)) return;

    dayNebula.tree.insert(new TreeNode(content), modifyNode)
  }

  public removeContent(content:Content){
    this.contents.remove(content.id)
  }

  public addNebula(nebula:Nebula){
    this.nebulas.add(nebula);
    return nebula;
  }

  public removeNebula(nebula:Nebula){
    this.nebulas.remove(nebula.id);
    for (const u of this.universes.all()){
      const index = u.nebulas.indexOf(nebula)
      if (index < 0) continue;
      u.nebulas.splice(index, 1);
    }
  }
}