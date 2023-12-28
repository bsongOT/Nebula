import { Tree } from "../../data-structure/tree";
import { WListView } from "./WListView";

export class TreeList<T> extends WListView<T>{
  protected tree:Tree<T>;
  protected constructor(tree:Tree<T>){
    super()
    this.tree = tree;
    
  }
}