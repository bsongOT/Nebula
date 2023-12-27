import { WButton } from "@/objects"
import { data, Content } from "../../data/Data"

export class StartNebulaButton extends WButton {
  public target:Content|undefined;
  constructor(target?:Content){
    super("start nebula");
    this.target = target;
    this.event.click.register(()=>{
      if (!this.target) return;
      data.selectedNebula = data.addNebula(
      this.target.title, "Story", this.target)

      window.open("./nebula.html", "_self")
    })
    this.event.click.register(()=>{})
  }
}