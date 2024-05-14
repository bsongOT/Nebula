export * from "./components/Content"
export * from "./components/Nebula"

import { Tree } from "@/data-structure/tree"
import { Coord, H, HexCoord, P } from "../../engine/utils/math/coord-system"
import {Content} from "./components/Content"
import { DataCollection } from "./DataCollection"
import { Dust } from "./components/Dust"
import {Nebula} from "./components/Nebula"
import {Universe} from "./components/Universe"
import {Relation} from "./components/Relation"
import { Packer, Unpacker } from "./DataParser"
import { DataComponent } from "./components/DataComponent"
import { engine } from "@/engine"

type DataKey = "all-dusts" | "all-contents" | "all-nebulas" | "all-universes" | "all-relations"
type NebulaBool = {
  nebula: Nebula,
  inverse: boolean
}
type AddingContentOption = {
  nebula: Nebula,
  day?: Date
}
type AddingNebulaOption = {
  universe: Universe,
  position: Coord,
  start?: HexCoord
}

export const $ = (name:string) => localStorage.getItem(name)
export const $$ = (name:DataKey, value:string) => localStorage.setItem(name, value)
export class Data {
  public readonly dusts;
  public readonly contents;
  public readonly nebulas;
  public readonly relations;
  public readonly universes;

  public readonly specialNebulas:{
    isolated: Nebula,
    day: {
      day:Date, 
      content:Content,
      action:"add"|"modify"|"remove"
    }[],
    lifetime: {
      deads: string[],
      modifieds: Content[],
      livings: Content[],
      news: Content[]
    },
    query: {
      main: Nebula
      condition: NebulaBool[][]
    }[],
    transform: {
      sum: {
        materials: Content[],
        output: Content
      }[],
      inverse: {
        material: Content,
        outputs: Content[]
      }[]
    }
  };

  public constructor(){
    const wildDusts = this.loadWildDataCollection("all-dusts")
    const wildContents = this.loadWildDataCollection("all-contents")
    const wildNebulas = this.loadWildDataCollection("all-nebulas")
    const wildUniverses = this.loadWildDataCollection("all-universes")
    const wildRelations = this.loadWildDataCollection("all-relations")

    this.dusts = new DataCollection(wildDusts.map(d => Unpacker.dust(d)))
    this.contents = new DataCollection(wildContents.map(c => Unpacker.content(c, this.dusts)))
    this.nebulas = new DataCollection(wildNebulas.map(n => Unpacker.nebula(n, this.contents)))
    this.relations = new DataCollection(wildRelations.map(r => Unpacker.relation(r, this.nebulas, this.contents, this.dusts)))
    this.universes = new DataCollection(wildUniverses.map(u => Unpacker.universe(u, this.nebulas, this.relations)))

    this.specialNebulas = {
      isolated: new Nebula({id: -2, name: "isolated"}),
      day: [],
      lifetime: {
        deads: [],
        modifieds: [],
        livings: [],
        news: []
      },
      query: [],
      transform: {
        sum: [],
        inverse: []
      }
    }

    engine.updater.register(() => {

    })
  }

  public addContent(content:Content, option:AddingContentOption){
    this.contents.add(content)
    this.specialNebulas.day.push({
      day: option.day ?? new Date(),
      content: content,
      action: "add"
    })
    this.specialNebulas.lifetime.news.push(content)
    option.nebula.palette.push(content)
    return content;
  }

  public removeContent(content:Content){
    const special = this.specialNebulas;
    const {news, livings, modifieds, deads} = special.lifetime;

    this.contents.remove(content.id)
    special.day.splice(
      special.day.findIndex(i => i.content === content), 1
    )
    if (news.includes(content)) news.splice(news.indexOf(content), 1)
    if (livings.includes(content)) livings.splice(livings.indexOf(content), 1)
    if (modifieds.includes(content)) modifieds.splice(modifieds.indexOf(content), 1)

    deads.push(content.title)
    content.id = -1;
  }

  public addNebula(nebula:Nebula, option:AddingNebulaOption){
    this.nebulas.add(nebula);
    option.universe.nebulaInfos.push({
      nebula: nebula,
      worldPos: option.position,
      start: option.start ?? H(-1, 0, 0)
    })
  }

  public removeNebula(nebula:Nebula){
    this.nebulas.remove(nebula.id);
    for (const u of this.universes.all()){
      const index = u.nebulaInfos.findIndex(ni => ni.nebula === nebula)
      if (index < 0) continue;
      u.nebulaInfos.splice(index, 1);
    }
  }

  private loadWildDataCollection<T extends DataKey>(keyword:T){
    const json = JSON.parse($(keyword) ?? "[]");
    const boxes = Array.from(json) as any[];

    return boxes
  }

  public findAddablePosition(univ:Universe){
    const universePoses = univ.nebulaInfos.map(ni => ni.worldPos);
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
}

export const data = new Data()