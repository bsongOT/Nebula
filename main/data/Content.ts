import {ContentBody} from "./ContentBody"
import { DataComponent } from "./DataComponent";
import {Nebula} from "./Nebula"

export type ContentKind = "Activity"|"Story"
export class Content implements DataComponent{
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

  public static load(obj:any):Content{
    let c = new Content(obj.title, obj.kind, obj.id);
    c.createdAt = new Date(obj.createdAt);
    c.updatedAt = new Date(obj.updatedAt);
    c.body = new ContentBody();
    c.parents = obj.parents;
    c.children = obj.children;
    c.nebulas = obj.nebulas;
    return c;
  }
  public pack(){
    const c = this;
    return {
      title: c.title,
      kind: c.kind,
      id: c.id,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      body: {

      },
      parents: c.parents.map(c => c.id),
      children: c.children.map(c => c.id),
      nebulas: c.nebulas.map(n => n.id)
    }
  }
}