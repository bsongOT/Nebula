import {Hexagon} from "@/CanvasObject"
import p5 from "p5";
import { Content } from "../../../data/components/Content";
import { r3 } from "@/utils/math/consts";

export class StarTile extends Hexagon{
  private readonly content:Content;
  constructor(state:"none"|"selected", content:Content){
    super()
    this.color = {
      none: "#cccccc",
      selected: "#2a99cc"
    }[state]
    this.content = content;
  }

  public render(p:p5){
    super.render(p);

    const s = this.side;
    const [x, y] = [this.position.x, this.position.y]
    
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