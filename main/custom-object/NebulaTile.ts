import {Nebula, data} from "../data/Data"
import { Square } from "../../engine/objects/CanvasObject/WSquare";
import { PolygonForm } from "../../engine/factors/forms/PolygonForm";

export class NebulaTile extends Square{
  constructor(nebula:Nebula, side: number){
    super(new PolygonForm(nebula.position.scale(side), side, "#2381de"));
    this.event.onclick(()=>{
      data.selectedNebula = nebula
      window.open("../nebula.html", "_self")
    })
  }
}