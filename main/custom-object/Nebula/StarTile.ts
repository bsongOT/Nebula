import {Hexagon} from "@/objects/CanvasObject"
import {r3} from "@/utils/mathconsts";
import p5 from "p5";
import { Content } from "../../data/components/Content";

export class StarTile extends Hexagon{
  private readonly content:Content;
  constructor(state:"none"|"selected", content:Content){
    super()
    this.form.color = {
      none: "#cccccc",
      selected: "#2a99cc"
    }[state]
    this.content = content;
  }

  public render(p:p5){
    super.render(p);

    const s = this.form.side;
    const [x, y] = [this.form.position.x, this.form.position.y]
    
    p.textAlign(p.CENTER, p.CENTER)
    p.textSize(8)
    p.text(
      this.content.title,
      x - r3 / 2 * s, y - s / 2,
      r3 * s, s
    )
    return this;
  }
}