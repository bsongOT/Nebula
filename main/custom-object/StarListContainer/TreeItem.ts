import { SelectableItem, Text } from "..";
import { Content, data } from "../../data/Data";
import { StarSpace } from "./StarSpace";

export class TreeItem extends SelectableItem<Content> {
  space:StarSpace;
  private $level:number = 0;
  public get level(){
    return this.$level;
  }
  private set level(v:number){
    this.$level = v;
  }
  public indent():TreeItem{
    if (!this.sibling[0]) return this;
    if (this.level > this.sibling[0].level + 1) return this;

    this.sibling[0].adopt(this)

    return this;
  }

  public outdent():TreeItem{
    if (this.level <= 0) return this;

    this.parent.bringDown(this)

    return this;
  }

  public constructor(space:StarSpace) {
    super();
    this.space = space;
    this.adopt(new Text(data.getContent(space.id)?.title ?? ""));
  }
  protected click() {
    this.space.select()
  }
}