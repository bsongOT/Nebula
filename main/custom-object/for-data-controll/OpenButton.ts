import {ButtonObject} from "../"
import {data, Content, Nebula} from "../../data/Data"
import { no_open_target } from "../../messages";

export class OpenButton extends ButtonObject{
  public target:Content|Nebula|undefined;
  constructor(target:Content|Nebula|undefined){
    super("Open");
    this.target = target;
  }
  protected click(){
    if (!this.target) return alert(no_open_target)
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