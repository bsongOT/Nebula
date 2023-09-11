export * from "./Content"
export * from "./Nebula"

import {Content, ContentKind} from "./Content"
import {Nebula, NebulaKind} from "./Nebula"
import {Playground} from "./Playground"
import {Relation} from "./Relation"

export const $ = (name:string) => localStorage.getItem(name)
export const $$ = (name:string, value:string) => localStorage.setItem(name, value)

export class Data {
  private contents:Content[];
  private nebulas:Nebula[];
  private playgrounds:Playground[];
  private relations:Relation[];
  
  get selectedContent():Content|undefined{   
    const id = Number($("selected-content"))
    return this.getContent(id)
  }
  set selectedContent(value:Content){
    $$("selected-content", value.id.toString())
  }
  get selectedNebula():Nebula|undefined{
    const id = Number($("selected-nebula"))
    return this.nebulas.find(n => n.id===id)
  }
  set selectedNebula(value:Nebula){
    $$("selected-nebula", value.id.toString())
  }
  
  constructor(){
    this.contents = JSON.parse($("all-contents") ?? "[]");
    this.nebulas = JSON.parse($("all-nebulas") ?? "[]");
    this.playgrounds = JSON.parse($("all-playgrounds") ?? "[]");
    this.relations = JSON.parse($("all-relations") ?? "[]")
  }
  
  public getContent(id:number):Content|undefined{
    if (isNaN(id)) return;
    if (this.contents.length <= 0) return;
    if (this.contents[this.contents.length - 1].id < id) return;
    if (this.contents[0].id > id) return;

    return this.contents[this.binarySearchContent(0, this.contents.length - 1, id)];
  }
  
  public addContent(title:string, kind:ContentKind):Content{
    const id = this.contents[this.contents.length - 1].id + 1;
    this.contents.push(new Content(title, kind, id))
    $$("all-contents", JSON.stringify(this.contents))
    return this.contents[this.contents.length - 1]
  }

  public removeContent(content:Content):void{
    const id = content.id;
    this.contents.splice(this.binarySearchContent(0, this.contents.length - 1, id), 1)
    $$("all-contents", JSON.stringify(this.contents))
  }

  public addNebula(title:string, kind:NebulaKind, orient:number):Nebula{
    const id = this.nebulas[this.nebulas.length - 1].id + 1;
    this.nebulas.push(new Nebula(title, id, kind, orient))
    $$("all-nebulas", JSON.stringify(this.nebulas))

    return this.nebulas[this.nebulas.length - 1]
  }

  public removeNebula(nebula:Nebula):void{
    
  }

  public getContents():Content[]{
    return this.contents.map(c => c)
  }

  public getNebulas():Nebula[]{
    return this.nebulas.map(n => n)
  }

  private binarySearchContent(start:number, end:number, value:number):number{
    const cs = this.contents;
    if (cs[start].id > value) return -1;
    if (cs[end].id < value) return -1;
    if (cs[start].id === value) return start
    if (cs[end].id === value) return end
  
    const t = Math.floor((start + end) / 2);
    if (cs[t].id >= value) 
      return this.binarySearchContent(start, t, value)
    else
      return this.binarySearchContent(t, end, value)
  }
}

export let data = new Data()
export const selectedContent = data.selectedContent;
export const selectedNebula = data.selectedNebula