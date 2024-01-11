import { Tree } from "../../data-structure/tree";
import { WListView } from "./WListView";

export class TreeList<T> extends WListView<T>{
  public readonly tree:Tree<T>;
  constructor(tree:Tree<T>){
    super()
    this.tree = tree;
  }
}