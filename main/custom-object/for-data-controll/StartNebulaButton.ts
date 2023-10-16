import {ButtonObject} from "@/objects"
import {data, Content} from "../../data/Data"

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
      this.target.title, "Story", this.target)

      window.open("./nebula.html", "_self")
      onclick()
    })
    return this;
  }
}