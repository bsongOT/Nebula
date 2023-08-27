import {ButtonObject} from "../"
import {data, Content, Nebula} from "../../data/Data"

export class OpenButton extends ButtonObject{
  target:Content|Nebula;
  constructor(target:Content|Nebula){
    super("Open");
    this.target = target;
  }
  click(){
    if (!this.target) return;
    if (this.target instanceof Content){
      data.selectedContent = this.target;
      window.open("../../pages/content-page/content-page.html", "_self")
    }
    else if (this.target instanceof Nebula){
      data.selectedNebula = this.target;
      window.open("../../pages/nebula/nebula.html", "_self")
    }
  }
}