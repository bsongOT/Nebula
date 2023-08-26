import {ContentBody} from "./ContentBody.js"

export class Content{
  title;
  id;
  kind;
  createdAt;
  updateAt;
  body;
  parents;
  children;
  nebulas;
  
  constructor(title, kind, id){
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