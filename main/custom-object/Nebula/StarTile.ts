import {Hexagon} from "@/objects/CanvasObject"
import {r3} from "@/utils/mathconsts";
import { PolygonForm } from "@/infos/PolygonForm";
import { StarLeafItem } from "../StarListContainer/StarLeafItem";

export class StarTile extends Hexagon{
  public listItem:StarLeafItem;
  public get isSelected():boolean{
    return this.listItem?.selected;
  }
  public get isOrient():boolean{
    if (!this.listItem) return false;
    return this.listItem.isOrient;
  }
  public get isValid():boolean{
    return !!this.listItem
  }
  get color(){
    if (this.isSelected) return "#99a720";
    if (this.isOrient) return "#da199a"
    if (this.isValid) return "#a2a9ca";
    return "#ffffff"
  }
  public constructor(listItem:StarLeafItem, form:PolygonForm){
    super(form)
    this.listItem = listItem;
    this.onclick(()=>{})
  }
  public render(){
    this.form.color = this.color
    super.render();

    const p = this.p
    const s = this.form.side;
    const [x, y] = [this.form.position.x, this.form.position.y]
    
    const content = this.listItem?.value
    if (!content) return this;
    
    p.textAlign(p.CENTER, p.CENTER)
    p.textSize(8)
    p.text(
      content.title,
      x - r3 / 2 * s, y - s / 2,
      r3 * s, s
    )
    return this;
  }
  public click(){
    if (this.listItem)
    this.listItem.list.selection = this.listItem;
    return this;
  }
  public onclick(onclick:()=>void){
    super.onclick(()=>{
      
      onclick()
    })
    return this;
  }
}