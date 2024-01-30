import {Nebula, data} from "../data/Data"
import { WSquare } from "../../engine/objects/CanvasObject/WSquare";
import { PolygonForm } from "../../engine/factors/forms/PolygonForm";

export class NebulaTile extends WSquare{
  constructor(nebula:Nebula, side: number){
    super()
    const pos = nebula.position.scale(side)
    this.form.moveAt(pos.x, pos.y)
    this.form.setSide(side)
    this.form.setColor("#2381de");
    this.input.onclick(()=>{
      data.selectedNebula = nebula
      window.open("../nebula.html", "_self")
    })
  }
}