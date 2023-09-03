import {ButtonObject} from "../"
import {data, Content, Nebula} from "../../data/Data.js"

export class StartNebulaButton extends ButtonObject {
  public target:Content;
  constructor(target:Content){
    super("start nebula");
    this.target = target;
  }
  protected click(){
    data.selectedNebula = data.addNebula(
      this.target.title, "Story", this.target.id)

    window.open("../nebula/nebula.html", "_self")
  }
}