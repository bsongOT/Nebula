import {Tree} from "../../engine/data-structure/tree"

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