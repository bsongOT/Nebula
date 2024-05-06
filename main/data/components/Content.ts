import { Tree } from "@/data-structure/tree";
import { DataComponent } from "./DataComponent";
import { Dust } from "./Dust";
import { DataCollection } from "../DataCollection";

type ContentInfo = {
  title?:string,
  actor?:string
}
export class Content implements DataComponent{
  id:number;
  title:string;
  dusts:Tree<Dust>;
  actor:string;
  
  constructor(info?:ContentInfo){
    this.title = info?.title ?? "";
    this.id = -1;
    this.dusts = new Tree()
    this.actor = info?.actor ?? "./default-actor.js"
  }

  static request(contents:DataCollection<Content>, search:ContentInfo){
    const content = contents.find(c => {
      for (const k in search){
        if (c[k as keyof Content] !== search[k as keyof ContentInfo]) return false;
      }
      return true;
    })

    if (content) return content;

    return contents.add(new Content(search))
  }
}