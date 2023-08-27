import {Tree} from "../../engine/data-structure/tree"

export type NebulaKind = "Type"|"Story"
export class Nebula{
  name:string;
  id:number;
  kind:NebulaKind;
  origin:number;
  tree:Tree<number>
  contentIds;
  directChildren;
  constructor(name:string, id:number, kind:NebulaKind, first:number){
    this.name = name;
    this.id = id;
    this.kind = kind;
    this.origin = first;
    this.contentIds = [first];
  }
  link(parent, child){
    if (!this.contentIds.includes(child.id)) this.contentIds.push(child.id);
    if (parent === this)
      return this.directChildren.push(child)
    if (!this.contentIds.includes(parent.id)) this.contentIds.push(parent.id);
    parent.children.push(child);
    child.parent = parent;
  }
}
export class NebulaNode {
  id:number;
  parent:NebulaNode;
  children:NebulaNode[];
  constructor(content){
    this.id = content.id;
    this.children = [];
  }
}