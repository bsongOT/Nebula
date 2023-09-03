import {SelectableList} from ".."
import {Content, Nebula} from "../../data/Data"
import { TreeItem } from "./TreeItem";

export class StarList extends SelectableList<Content>{
  constructor(nebula:Nebula){
    super();
    this.selection = this.adopt(
      new TreeItem()
    )
  }
}