import {Tree} from "../../engine/data-structure/tree"
import { Content } from "./Data";

export type NebulaKind = "Type"|"Story"
export class Nebula{
  name:string;
  id:number;
  kind:NebulaKind;
  orient:number;
  tree:Tree<number>
  constructor(name:string, id:number, kind:NebulaKind, first:number){
    this.name = name;
    this.id = id;
    this.kind = kind;
    this.orient = first;
    this.tree = new Tree()
  }
}
export class NebulaNode {
  id:number;
  parent:NebulaNode;e
  children:NebulaNode[];
  constructor(content:Content){
    this.id = content.id;
    this.children = [];
  }
}