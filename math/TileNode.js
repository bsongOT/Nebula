import {Hexagon} from "../../../objects/CanvasObject/Hexagon.js"

export class TileNode extends Hexagon{
  constructor(grid, hexpos, pos, side, color, action, system){
    super(pos, side, color);
    this.grid = grid;
    this.hexpos = hexpos;
    this.action = action;
    this.system = "yz"//system ?? "3 axis";
  }
  mouseOver(){
    this.action();
  }
  render(){
    super.render();
    if (this.color !== "#cccccc"){
      const h = this.hexpos;
      let coordDisplay = (()=>{
      switch(this.system){
        case "3 axis": 
          return h;
        case "xy":
          return `${h.one - h.five}, ${h.three + h.five}`
        case "xz":
          return `${h.one + h.three}, ${h.five + h.three}`
        case "yz":
          return `${h.three + h.one}, ${h.five - h.one}`
      }})()
      this.p.text(coordDisplay, this.pos.x, this.pos.y)
      this.p.textAlign(this.p.CENTER)
    }
  }
}