import {ButtonObject} from "../objects/index.js"
import {data, nebulas, Nebula} from "../../data/Data.js"

export class StartNebulaButton extends ButtonObject {
  target
  constructor(target){
    super("start nebula");
    this.target = target;
  }
  click(){
    const n = new Nebula(
      this.target.title, nebulas.length,
      "flow", this.target)
    
    nebulas.push(n)
    data.selectedNebula = n
    data.save()

    window.open("../nebula/nebula.html", "_self")
  }
}