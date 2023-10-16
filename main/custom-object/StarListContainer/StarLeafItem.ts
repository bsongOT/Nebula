import { Text, WebObject } from "@/objects";
import { TreeNode } from "@/data-structure/tree";
import { ISelectable } from "../../../engine/interfaces/ISelectable";
import { Content } from "../../data/Data";
import { StarList } from "./StarList";
import { ListItem, ListView } from "@/objects/list";

export class StarLeafItem extends ListItem<Content,WebObject<any, any>> implements ISelectable {
  private $list:StarList;
  public get list(){
    return this.$list;
  }
  private set list(v:StarList){
    this.$list = v;
  }
  private $isOrient:boolean;
  public get isOrient(){
    return this.$isOrient
  }
  private set isOrient(v:boolean){
    this.$isOrient = v;
  }
  private text:Text;
  private $matchedTreeNode:TreeNode<StarLeafItem>;
  public get matchedTreeNode(){
    return this.$matchedTreeNode;
  }
  private set matchedTreeNode(v:TreeNode<StarLeafItem>){
    this.$matchedTreeNode = v;
  }
  public indent():StarLeafItem{
    if (!this.sibling[0]) return this;

    const s = this.sibling[0];

    if (s.children.length < 2) 
      s.adopt(new ListView<Content,any>())
    
    s.children[1].adopt(this)
    this.matchedTreeNode.tree.insert(
      this.matchedTreeNode.leftFriend,
      this.matchedTreeNode
    )

    return this;
  }

  public outdent():StarLeafItem{
    if (this.parent === this.list) return this;
    const prevList = this.parent;

    this.parent.parent.bringDown(this)
    this.matchedTreeNode.tree.insertAsRightFriend(
      this.matchedTreeNode.parent, 
      this.matchedTreeNode)

    if (prevList.children.length <= 0)
      prevList.remove()

    return this;
  }

  public updent(){
    if (!this.sibling[0]) return this;

    this.promote()
    this.matchedTreeNode.tree.insertAsLeftFriend(
      this.matchedTreeNode.leftFriend,
      this.matchedTreeNode
    )

    return this;
  }

  public downdent(){
    if (!this.sibling[1]) return this;

    this.demote()
    this.matchedTreeNode.tree.insertAsRightFriend(
      this.matchedTreeNode.rightFriend,
      this.matchedTreeNode
    )

    return this;
  }

  public constructor(content:Content, list:StarList, treeNode:TreeNode<StarLeafItem>, isOrient:boolean) {
    super();
    this.list = list;
    this.value = content;
    this.text = this.adopt(new Text(content.title));
    this.matchedTreeNode = treeNode;
    this.isOrient = isOrient;
    this.onclick(()=>{})
  }
  private $selected:boolean;
  public get selected():boolean {
    return this.$selected;
  }
  public set selected(v:boolean) {
    if (v) this.text.addClass("selected")
    else this.text.removeClass("selected")
    this.$selected = v;
  }
  public onclick(onclick:()=>void) {
    this.text.onclick(()=>{
      this.list.selection = this;
      onclick()
    })
    return this;
  }
}