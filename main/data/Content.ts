import {ContentBody} from "./ContentBody"
import {Nebula} from "./Nebula"

export type ContentKind = "Activity"|"Story"
export class Content{
  title:string;
  id:number;
  kind:ContentKind;
  createdAt:Date;
  updatedAt:Date;
  body:ContentBody;
  parents:Content[];
  children:Content[];
  nebulas:Nebula[];
  
  constructor(title:string, kind:ContentKind, id:number){
    this.title = title;
    this.kind = kind;
    this.id = id;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.body = new ContentBody()
    this.parents = [];
    this.children = [];
    this.nebulas = [];
  }
}