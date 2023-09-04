import {ButtonObject} from "../"
import {data, Content, Nebula} from "../../data/Data.js"

export class StartNebulaButton extends ButtonObject {
  public target:Content|undefined;
  constructor(target?:Content){
    super("start nebula");
    this.target = target;
    this.onclick(()=>{})
  }
  public onclick(onclick:()=>void){
    super.onclick(()=>{
      if (!this.target) return;
      data.selectedNebula = data.addNebula(
      this.target.title, "Story", this.target.id)

      window.open("../nebula/nebula.html", "_self")
      onclick()
    })
    return this;
  }
}