import { Coord } from "../../../engine/coord-system";
import { Tree, TreeNode } from "../../../engine/data-structure/tree"
import { Content } from "../Data";
import { DataCollection } from "../DataCollection";
import { DataComponent } from "./DataComponent";

export class Nebula implements DataComponent{
  id:number;
  name:string;
  tree:Tree<Content>
  position:Coord;
  constructor(){
    this.name = "";
    this.id = -1;
    this.tree = new Tree()
    this.position = new Coord(-1, -1)
  }
}