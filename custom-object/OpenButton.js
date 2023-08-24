import {ButtonObject} from "../objects/index.js"
import {data} from "../data/Data.js"

export class OpenButton extends ButtonObject{
  target;
  kind;
  constructor(target, kind){
    super("Open");
    this.target = target;
    this.kind = kind;
  }
  click(){
    if (!this.target) return;
    if (this.kind === "content"){
      data.selectedContent = this.target;
      window.open("../../pages/content-page/content-page.html", "_self")
    }
    else if (this.kind === "nebula"){
      data.selectedNebula = this.target;
      window.open("../../pages/nebula/nebula.html", "_self")
    }
  }
}