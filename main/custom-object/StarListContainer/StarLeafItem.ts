import { SelectableItem, Text } from "..";
import { Content, data } from "../../data/Data";
import { StarList } from "./StarList";

export class StarLeafItem extends SelectableItem<Content> {
  //#region starList get private set
  private $starList:StarList;
  public get starList(){
    return this.$starList;
  }
  private set starList(v:StarList){
    this.$starList = v;
  }
  //#endregion
  private text:Text;
  public indent():StarLeafItem{
    if (!this.sibling[0]) return this;

    this.sibling[0].children[1].adopt(this)

    return this;
  }

  public outdent():StarLeafItem{
    if (this.parent === this.starList) return this;

    this.parent.parent.bringDown(this)

    return this;
  }

  public constructor(id:number) {
    super();
    const c = data.getContent(id);
    if (!c) return;
    this.value = c;
    this.text = this.adopt(new Text(c.title));
    this.onclick(()=>{})
  }
  public onclick(onclick:()=>void) {
    this.text.onclick(()=>{
      this.starList.selection = this;
      onclick()
    })
    return this;
  }
}