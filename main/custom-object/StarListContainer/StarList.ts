import {WListView} from "@/objects/list/"
import { Tree, TreeNode } from "@/data-structure/tree";
import { ISelectable } from "@/interfaces/ISelectable";
import { SelectableSpace } from "@/virtual spaces/SelectableSpace";
import {Content, Nebula} from "../../data/Data"
import { StarLeafItem } from "./StarLeafItem";

export class StarList extends WListView<Content>{
  private space:SelectableSpace<ISelectable>;
  public readonly tree:Tree<Content>;
  public get selection(){
    return this.space.selection as StarLeafItem;
  }
  public set selection(v:StarLeafItem){
    this.space.selection = v;
  }
  constructor(nebula:Nebula){
    super();
    this.class.add("star-list")
    this.space = new SelectableSpace();
    this.tree = nebula.tree;
    this.tree
      .map((c, bn) => new StarLeafItem(c!, this, bn === nebula.orient))
      .tourNode(n => {
        if (n.parent === n.tree.root){
          return this.family.adopt(n.data!)
        }
        n.parent!.data!.put(n.data!)
      })
  }
  public updateData(){
    this.tree.nodes.forEach(n => this.tree.remove(n))
    const makeTree = (item:StarLeafItem, node:TreeNode<Content>) => {
      if (!item.localList) return;
      for (let c of item.localList.family.children as StarLeafItem[]){
        const childNode = new TreeNode(this.tree, c.data!)
        this.tree.insert(node, childNode)
        makeTree(c, childNode)
      }
    }
  }
  public add(content:Content){
    const item = new StarLeafItem(content, this, false)
    this.family.adopt(item);
    this.space.regist(item);
    this.updateData()
  }
}