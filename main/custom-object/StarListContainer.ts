import {Container, ButtonObject} from "."
import {StarList} from "./StarListContainer/StarList"
import { StarLeafItem } from "./StarListContainer/StarLeafItem";
import {Nebula, Content} from "../data/Data"

export class StarListContainer extends Container{
  list:StarList;
  nebula:Nebula;
  get selection(){
    return this.list.selection as StarLeafItem;
  }
  constructor(nebula:Nebula){
    super();
    [
    new StarList(nebula),
    new Container([
      new ButtonObject("↑").addClass("up-arrow").onclick(this.moveUp),
      new ButtonObject("←").addClass("left-arrow").onclick(this.moveLeft),
      new ButtonObject("↓").addClass("down-arrow").onclick(this.moveDown),
      new ButtonObject("→").addClass("right-arrow").onclick(this.moveRight)
    ]).addClass("arrow-button-container")
    ].forEach(e => this.adopt(e));
    this.nebula = nebula;
  }
  moveUp = () => this.selection.promote()
  moveDown = () => this.selection.demote()
  moveLeft = () => this.selection.outdent()
  moveRight = () => this.selection.indent()
  add = (content:Content) => {
    this.list.adopt(
      new StarLeafItem(content.id)
    )
  }
}