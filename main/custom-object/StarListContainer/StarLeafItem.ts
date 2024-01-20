import { WText } from "@/objects";
import { TreeNode } from "@/data-structure/tree";
import { ISelectable } from "../../../engine/interfaces/ISelectable";
import { Content } from "../../data/Data";
import { StarList } from "./StarList";
import { WListItem, WListView } from "@/objects/list";

export class StarLeafItem extends WListItem<Content> implements ISelectable {
  public readonly list:StarList;

  private readonly text:WText;
  public localList:WListView<Content> | undefined

  public readonly isOrient:boolean;

  public put(item:StarLeafItem){
    this.localList?.family.adopt(item)
    return this
  }

  public indent(){
    const l = this.family.leftFriend as StarLeafItem;

    if (!l) return this;
    if (!l.localList) 
      l.localList = l.family.adopt(new WListView<Content>())
    
    l.localList.family.adopt(this)

    this.list.updateData()
  }

  public outdent(){
    if (this.family.parent === this.list) return;
    const prevList = this.family.parent!;

    this.family.parent!.family.parent!.family.bringDown(this)
    this.list.updateData()

    if (prevList.family.children.length <= 0)
      prevList.family.remove()
  }

  public updent(){
    if (!this.family.leftFriend) return;

    this.family.promote()
    this.list.updateData()
  }

  public downdent(){
    if (!this.family.rightFriend) return;

    this.family.demote()
    this.list.updateData()
  }

  public constructor(content:Content, list:StarList, isOrient:boolean) {
    super(content);
    this.list = list;
    this.text = this.family.adopt(new WText(content.title));
    this.isOrient = isOrient;
    this.text.input.onclick(()=>{
      this.list.selection = this;
    })
  }
  public get selected():boolean {
    return this.text.class.contains("selected");
  }
  public set selected(v:boolean) {
    if (v) this.text.class.add("selected")
    else this.text.class.remove("selected")
  }
}