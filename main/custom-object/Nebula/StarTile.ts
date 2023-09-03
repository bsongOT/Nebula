import {Hexagon} from ".."
import {data} from "../../data/Data"
import {r3} from "../../../engine/utils/mathconsts";
import { PolygonForm } from "../../../engine/infos/PolygonForm";
import {StarSpace} from "../StarListContainer/StarSpace"

export class StarTile extends Hexagon{
  private space:StarSpace;
  get color(){
    if (this.space.isSelected) return "#99a720";
    if (this.space.isOrient) return "#da199a"
    if (this.space.isValid) return "#a2a9ca";
    return "#ffffff"
  }
  public constructor(form:PolygonForm, space:StarSpace){
    super(form)
    this.space = space;
  }
  public render(){
    super.render();
    const p = this.p
    const s = this.form.side;
    const [x, y] = [this.form.position.x, this.form.position.y]
    
    if (!this.space.id) return this; 
    const content = data.getContent(this.space.id)
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
  protected click(){
    this.space.select()
  }
}