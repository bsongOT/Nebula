import {Container, ButtonObject} from "../objects/index.js"
import {ContentsTreePanel, TreeItem} from "./TOCContainer/ContentsTreePanel.js"
import {NebulaNode} from "../data/Data.js"

export class TOCContainer extends Container{
  panel;
  nebula;
  get selection(){
    return this.panel.selection;
  }
  constructor(nebula){
    super({}, [
    this.panel = new ContentsTreePanel(nebula),
    new Container("arrow-button-container",[
      new ButtonObject("↑", "up-arrow", this.moveUp),
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
  add = (content) => {
    const node = new NebulaNode(content)
    this.panel.adopt(
      new TreeItem(node, this.panel))
    console.log(this.nebula)
    this.nebula.link(this.nebula, node)
  }
}