import {Container, ButtonObject} from "./"
import {ContentsTreePanel, TreeItem} from "./TOCContainer/ContentsTreePanel"
import {NebulaNode, Nebula, Content} from "../data/Data"

export class TOCContainer extends Container{
  panel:ContentsTreePanel;
  nebula:Nebula;
  get selection(){
    return this.panel.selection;
  }
  constructor(nebula:Nebula){
    super({}, [
    new ContentsTreePanel(nebula),
    new Container(
      {class: "arrow-button-container"},[
      new ButtonObject("↑", {class: "up-arrow", onclick: this.moveUp}),
      new ButtonObject("←", "left-arrow", this.moveLeft),
      new ButtonObject("↓", "down-arrow", this.moveDown),
      new ButtonObject("→", "right-arrow", this.moveRight)
    ])
    ]);
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
    console.log(this.nebula)
    this.nebula.link(this.nebula, node)
  }
}