import {ListItem} from "../objects/index.js"
import {data} from "../data/Data.js"

export class NebulaItem extends ListItem{
  nebula;
  constructor(nebula){
    super();
    this.value = nebula.name;
    this.nebula = nebula;
  }
  click(){
    data.selectedNebula = this.nebula
    window.open("../nebula/nebula.html", "_self")
  }
}