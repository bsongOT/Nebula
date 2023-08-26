import {Hexagon} from "../../objects/index.js"
import {data} from "../../data/Data.js"

export class Tile extends Hexagon{
  tree;
  node;
  get isSelected(){
    return this.tree.selection === this.node
  }
  isOrigin;
  get isValid(){
    return !!this.node
  }
  get color(){
    if (this.isSelected) return "#99a720";
    if (this.isOrigin) return "#da199a"
    if (this.isValid) return "#a2a9ca";
    return "#ffffff"
  }
  constructor(pos,side,node,tree){
    super(pos,side)
    this.node=node
    this.tree=tree
  }
  render(){
    super.render();
    const p = this.parent.p
    if (!this.isValid) return;
    
    p.textAlign(p.CENTER, p.CENTER)
    p.textSize(8)
    p.text(
      data.getContent(this.node.node.id).title,
      this.pos.x - r3 / 2 * this.side, this.pos.y - this.side / 2,
        r3 * this.side, this.side
    )
  }
  click(){
    if (!this.isValid) return;
    this.tree.selection = this.node
  }
}