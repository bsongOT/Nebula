import { WText } from "@/objects";
import { TreeNode } from "@/data-structure/tree";
import { ISelectable } from "../../../engine/interfaces/ISelectable";
import { Content } from "../../data/Data";
import { StarList } from "./StarList";
import { ListItem, ListView } from "@/objects/list";

export class StarLeafItem extends ListItem<Content> implements ISelectable {
  private $list:StarList;
  public get list(){ return this.$list; }
  private set list(v:StarList){ this.$list = v; }
  private $isOrient:boolean;
  public get isOrient(){ return this.$isOrient }
  private set isOrient(v:boolean){ this.$isOrient = v; }
  private text:WText;
  private $matchedTreeNode:TreeNode<StarLeafItem>;
  public get matchedTreeNode(){
    return this.$matchedTreeNode;
  }
  private set matchedTreeNode(v:TreeNode<StarLeafItem>){
    this.$matchedTreeNode = v;
  }
  public indent():StarLeafItem{
    if (!this.family.leftFriend) return this;

    const l = this.family.leftFriend;

    if (l.family.children.length < 2) 
      l.family.adopt(new ListView<Content>())
    
    l.family.children[1].family.adopt(this)
    this.matchedTreeNode.tree.insert(
      this.matchedTreeNode.leftFriend,
      this.matchedTreeNode
    )

    return this;
  }

  public outdent():StarLeafItem{
    if (this.family.parent === this.list) return this;
    const prevList = this.family.parent!;

    this.family.parent!.family.parent!.family.bringDown(this)
    this.matchedTreeNode.tree.insertAsRightFriend(
      this.matchedTreeNode.parent, 
      this.matchedTreeNode)

    if (prevList.family.children.length <= 0)
      prevList.family.remove()

    return this;
  }

  public updent(){
    if (!this.family.leftFriend) return this;

    this.family.promote()
    this.matchedTreeNode.tree.insertAsLeftFriend(
      this.matchedTreeNode.leftFriend,
      this.matchedTreeNode
    )

    return this;
  }

  public downdent(){
    if (!this.family.rightFriend) return this;

    this.family.demote()
    this.matchedTreeNode.tree.insertAsRightFriend(
      this.matchedTreeNode.rightFriend,
      this.matchedTreeNode
    )

    return this;
  }

  public constructor(content:Content, list:StarList, treeNode:TreeNode<StarLeafItem>, isOrient:boolean) {
    super();
    this.$list = list;
    this.value = content;
    this.text = this.family.adopt(new WText(content.title));
    this.$matchedTreeNode = treeNode;
    this.isOrient = isOrient;
    this.$selected = false;
    this.text.event.click.register(()=>{
      this.list.selection = this;
    })
    this.text.event.click.register(()=>{})
  }
  private $selected:boolean;
  public get selected():boolean {
    return this.$selected;
  }
  public set selected(v:boolean) {
    if (v) this.text.class.add("selected")
    else this.text.class.remove("selected")
    this.$selected = v;
  }
}