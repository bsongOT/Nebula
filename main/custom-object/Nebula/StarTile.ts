import {Hexagon} from ".."
import {data} from "../../data/Data"
import {r3} from "../../../engine/utils/mathconsts";
import { PolygonForm } from "../../../engine/infos/PolygonForm";
import { StarLeafItem } from "../StarListContainer/StarLeafItem";

export class StarTile extends Hexagon{
  public listItem:StarLeafItem|undefined;
  public isSelected:boolean;
  public isOrient:boolean;
  public isValid:boolean;
  get color(){
    if (this.isSelected) return "#99a720";
    if (this.isOrient) return "#da199a"
    if (this.isValid) return "#a2a9ca";
    return "#ffffff"
  }
  public constructor(form:PolygonForm){
    super(form)
    this.onclick(()=>{})
  }
  public render(){
    super.render();
    const p = this.p
    const s = this.form.side;
    const [x, y] = [this.form.position.x, this.form.position.y]
    
    if (!this.listItem?.value?.id) return this; 
    const content = data.getContent(this.listItem.value.id)
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
  public onclick(onclick:()=>void){
    super.onclick(()=>{
      
      onclick()
    })
    return this;
  }
}