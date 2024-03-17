import { Tree } from "@/data-structure/tree";
import { DataComponent } from "./DataComponent";
import { Dust } from "./Dust";

export class Content implements DataComponent{
  id:number;
  title:string;
  dusts:Tree<Dust>;
  actor:string;
  
  constructor(){
    this.title = "";
    this.id = -1;
    this.dusts = new Tree()
    this.actor = "./default-actor.js"
  }
}