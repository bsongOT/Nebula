import {ButtonObject} from "../"
import {data, Content, Nebula} from "../../data/Data.js"

export class StartNebulaButton extends ButtonObject {
  public target:Content;
  constructor(target:Content){
    super("start nebula");
    this.target = target;
  }
  click(){
    data.selectedNebula = data.addNebula(
      this.target.title, "Story", this.target)

    window.open("../nebula/nebula.html", "_self")
  }
}