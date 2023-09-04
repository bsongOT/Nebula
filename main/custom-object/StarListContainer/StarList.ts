import {ListItem, ListView, SelectableList} from ".."
import { TreeNode } from "../../../engine/data-structure/tree";
import {Content, Nebula} from "../../data/Data"
import { StarLeafItem } from "./StarLeafItem";

export class StarList extends SelectableList<Content>{
  public constructor(nebula:Nebula){
    super();
    const applyLeaf = (target:ListView<Content,ListItem<Content,any>>,dataTarget:TreeNode<number>) => {
      for (let c of dataTarget.children){
        if (!c.data) continue;
        const t = target.adopt(new StarLeafItem(c.data))
        if (c.children.length > 0){
          const l = t.adopt(new ListView<Content,StarLeafItem>())
          applyLeaf(l, c);
        }
      }
    }
    applyLeaf(this, nebula.tree.root)
  }

}