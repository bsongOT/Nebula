export * from "./Content"
export * from "./Nebula"

import { Tree, TreeNode } from "@/data-structure/tree"
import { Coord } from "../../engine/coord-system"
import { nebulaSpaceSize } from "../consts"
import {Content, ContentKind} from "./Content"
import { DataCollection } from "./DataCollection"
import { Dust } from "./Dust"
import {Nebula, NebulaKind} from "./Nebula"
import {Playground} from "./Playground"
import {Relation} from "./Relation"

export const $ = (name:string) => localStorage.getItem(name)
export const $$ = (name:string, value:string) => localStorage.setItem(name, value)
export class Data {
  private $contents:DataCollection<Content>;
  private $nebulas:DataCollection<Nebula>;
  private $playgrounds:DataCollection<Playground>;
  private $relations:DataCollection<Relation>;
  private $dusts:DataCollection<Dust>;

  public get contents(){return this.$contents}
  public get nebulas(){return this.$nebulas}
  public get playgrounds(){return this.$playgrounds}
  public get relations(){return this.$relations}
  public get dusts(){return this.$dusts}
  
  get selectedContent():Content|undefined{   
    const id = Number($("selected-content"))
    return this.contents.get(id)
  }
  set selectedContent(value:Content){
    $$("selected-content", value.id.toString())
  }
  get selectedNebula():Nebula|undefined{
    const id = Number($("selected-nebula"))
    return this.nebulas.get(id)
  }
  set selectedNebula(value:Nebula){
    $$("selected-nebula", value.id.toString())
  }
  
  constructor(){
    this.$contents = new DataCollection(JSON.parse($("all-contents") ?? "[]").map(c => Content.load(c)));
    this.$nebulas = new DataCollection(JSON.parse($("all-nebulas") ?? "[]").map(n => Nebula.load(n, this.contents)));
    this.$playgrounds = new DataCollection(JSON.parse($("all-playgrounds") ?? "[]")/*.map(p => Playground.load(p))*/);
    this.$relations = new DataCollection(JSON.parse($("all-relations") ?? "[]")/*.map(r => Relation.load(r))*/);
    this.$dusts = new DataCollection(JSON.parse($("all-dusts") ?? "[]")/*.map(d => Dust.load(d))*/);
  }
  
  public addContent(title:string, kind:ContentKind):Content{
    const content = this.contents.add(new Content(title, kind, NaN))
    $$("all-contents", JSON.stringify(this.$contents.map(c => c.pack())))
    return content;
  }
  public addNebula(name:string, kind:NebulaKind, first:Content){
    const tree = new Tree<Content>();
    tree.insert(tree.root, new TreeNode<Content>(tree, first))
    const nebula = this.nebulas.add(
      new Nebula(name, NaN, kind, this.findPos(), tree, 0)
    )
    $$("all-nebulas", JSON.stringify(this.nebulas.map(n => n.pack())))
    return nebula;
  }

  private findPos():Coord{
    let maxx = Math.max(...this.nebulas.map(n => n.position.x));
    if (maxx < 0) maxx = 0;
    let maxy = Math.max(...this.nebulas.filter(n => n.position.x === maxx).map(n => n.position.y));
    if (maxy < 0) maxy = 0;
    if (maxy < nebulaSpaceSize - 2)
      return new Coord(maxx, maxy + 2)
    else
      return new Coord(maxx + 2, 0)
  }
  public getNebulaSpaceTotalPage(){
    const total = Math.ceil(Math.max(...this.nebulas.map(n => n.position.x)) / nebulaSpaceSize);
    if (total < 0) return 1;
    return total + 1;
  }
}

export let data = new Data()
export const selectedContent = data.selectedContent;
export const selectedNebula = data.selectedNebula