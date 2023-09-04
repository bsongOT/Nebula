import {ListItem, Text} from "./"
import {Nebula, data} from "../data/Data"

export class NebulaItem extends ListItem<Nebula,any>{
  constructor(nebula:Nebula){
    super();
    this.value = nebula;
    this.adopt(new Text(nebula.name))
  }
  onclick(onclick:()=>void){
    super.onclick(()=>{
      data.selectedNebula = this.value
      window.open("../nebula/nebula.html", "_self")
      onclick()
    })
    return this;
  }
}