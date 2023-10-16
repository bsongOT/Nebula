import { Tree } from "../../data-structure/tree";
import { ListItem } from "./ListItem";
import { ListView } from "./ListView";

export class TreeList<T> extends ListView<T, ListItem<T, any>>{
  protected tree:Tree<T>;
  constructor(tree:Tree<T>){
    super()
    this.tree = tree;
    
  }
}