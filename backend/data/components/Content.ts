import { Tree } from "@/data-structure/tree";
import { DataComponent } from "./DataComponent";
import { Dust } from "./Dust";
import { DataCollection } from "../DataCollection";

export class Content implements DataComponent{
  id:number;
  title:string;
  dusts:Tree<Dust>;
  
  constructor(info?:Partial<Content>){
    this.title = info?.title ?? "Content";
    this.id = info?.id ?? -1;
    this.dusts = info?.dusts ?? new Tree()
  }

  static request(contents:DataCollection<Content>, search:Partial<Content>){
    const content = contents.find(c => {
      for (const k in search){
        if (c[k as keyof Content] !== search[k as keyof Content]) return false;
      }
      return true;
    })

    if (content) return content;

    return contents.add(new Content(search))
  }
}