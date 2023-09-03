import {Container, ButtonObject} from "."
import {StarList} from "./StarListContainer/ContentsTreePanel"
import { TreeItem } from "./StarListContainer/TreeItem";
import {NebulaNode, Nebula, Content} from "../data/Data"

export class StarListContainer extends Container{
  panel:StartList;
  nebula:Nebula;
  get selection(){
    return this.panel.selection;
  }
  constructor(nebula:Nebula){
    super({});
    [
    new StarList(nebula),
    new Container(
      {class: "arrow-button-container"},[
      new ButtonObject("↑", {class: "up-arrow", onclick: this.moveUp}),
      new ButtonObject("←", {class: "left-arrow", onclick: this.moveLeft}),
      new ButtonObject("↓", {class: "down-arrow", onclick: this.moveDown}),
      new ButtonObject("→", {class: "right-arrow", onclick: this.moveRight})
    ])
    ].forEach(e => this.adopt(e));
    this.nebula = nebula;
  }
  moveUp = () => {
    this.selection.promote()
  }
  moveDown = () => this.selection.demote()
  moveLeft = () => this.selection.parent.bringDown(this.selection)
  moveRight = () => this.selection.sibling[0].adopt(this.selection)
  add = (content:Content) => {
    const node = new NebulaNode(content)
    this.panel.adopt(
      new TreeItem(node, this.panel))
    this.nebula.link(this.nebula, node)
  }
}