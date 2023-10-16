import {ListView} from "@/objects/list/"
import { Tree, TreeNode } from "@/data-structure/tree";
import { ISelectable } from "@/interfaces/ISelectable";
import { SelectableSpace } from "@/virtual spaces/SelectableSpace";
import {Content, Nebula} from "../../data/Data"
import { StarLeafItem } from "./StarLeafItem";

export class StarList extends ListView<Content, StarLeafItem>{
  private space:SelectableSpace<ISelectable>;
  private $tree:Tree<StarLeafItem>;
  public get tree(){
    return this.$tree;
  }
  private set tree(v:Tree<StarLeafItem>){
    this.$tree = v;
  }
  public get selection(){
    return this.space.selection as StarLeafItem;
  }
  public set selection(v:StarLeafItem){
    this.space.selection = v;
  }
  public constructor(nebula:Nebula){
    super();
    this.addClass("star-list")
    this.space = new SelectableSpace();
    this.tree = nebula.tree.map((c, bn, an) => new StarLeafItem(c, this, an, nebula.orient === bn));
    this.tree.tourNode(n => {
      this.space.regist(n.data)
      if (n.parent === this.tree.root){
        this.adopt(n.data)
        return;
      }
      n.data.parent.children[1].adopt(n.data)
      if (n.children.length > 0){
        n.data.adopt(new ListView<Content, StarLeafItem>())
      }
    })
  }
  public add(content:Content){
    const node = new TreeNode<StarLeafItem>(this.tree)
    const item = new StarLeafItem(content, this, node, false)
    node.data = item;

    this.adopt(item);
    this.space.regist(item);
    this.tree.insert(this.tree.root, node)
  }
}