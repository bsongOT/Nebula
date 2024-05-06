import { Coord } from "../../../engine/utils/math/coord-system";
import { Tree, TreeNode } from "../../../engine/data-structure/tree"
import { Content } from "../Data";
import { DataCollection } from "../DataCollection";
import { DataComponent } from "./DataComponent";

export class Nebula implements DataComponent{
  id:number;
  name:string;
  tree:Tree<Content>;
  palette:Content[];

  constructor(info?:{
    name?: string,
    id?:number
  }){
    this.name = info?.name ?? "";
    this.id = info?.id ?? -1;
    this.tree = new Tree()
    this.palette = [];
  }
  toString(){
    return `
      id: ${this.id}
      name: ${this.name}
      treeLength: ${this.tree.length}
    `.split("\n").map(l => l.trim()).join("\n");
  }
}