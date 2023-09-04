import {
  BodyObject,
  SelectMenu,
  Option,
  CanvasScreen,
  CanvasContainer,
  Line
} 
from "../../../engine/objects"
import {
  UpperMenu,
  ContentsContainer,
  TitleInput,
  AddInTreeButton,
  StarTile,
  StarListContainer
} 
from "../../custom-object"
import {Coord, HexCoord} from "../../../engine/coord-system"
import {tour} from "../../../engine/utils/utils.js"
import {HexGrid} from "../../../engine/data-structure/hexgrid.js"
import {selectedNebula, data} from "../../data/Data"
import p5 from "p5"
import { PolygonForm } from "../../../engine/infos/PolygonForm"

const p = new p5((pp)=> {
  pp.setup = () => {
    init()
  },
  pp.draw = () => {
    update();
  }
  pp.mousePressed = () => {
    tour(canvas, 0, 0, (n)=>{
      if (n === canvas) return;
      if (n.isIn(p.mouseX, p.mouseY)){
        n.click();
      }
    })
  }
})

let grid = new HexGrid(new HexCoord(6,6,6));
let nebula = selectedNebula;
let cc;
let slc;

if (!nebula) throw "Error";

const body = new BodyObject([
  new UpperMenu(),
  new TitleInput(nebula),
  new SelectMenu([
    new Option("flow"),
    new Option("type")
  ]),
  cc = new ContentsContainer(data.getContents()),
  slc = new StarListContainer(nebula),
  new AddInTreeButton(cc, slc)
]);

let canvas;
let effectBox;
let tileBox;

const init = () => {
  canvas = new CanvasScreen(
    p, p.windowWidth, p.windowWidth,
    [
      effectBox = new CanvasContainer(),
      tileBox = new CanvasContainer()
    ]
  )
  p.background("#aaaaaa")
}
const setGrid = (size) => {
  tileBox.empty()
  grid = new HexGrid(size)

  const pivot = new HexCoord(size-1,0,size-1)
  let pos = new HexCoord(0,0,0)

  for (let i = 0; i < grid.area; i++) {
    const star = tileBox.adopt(
      new StarTile(
        new PolygonForm(
        pos.sub(pivot).toCoord(20).add(new Coord(p.width/2,p.height/2)),
        20, "#ffffff00"
        )
      ))
    grid.setVal(pos, star)
    pos = grid.next(pos);
  }
}
const update = () => {
  //data update
  
  let nodePoses:{node:any, pos:HexCoord}[] = [];
  let pos = new HexCoord(0,-1,0)
  let prevD = 1;
  for (let t of tileBox.children){
    t.node = undefined;
  }
  tour(nebula?.tree.root, 0, 0, (n, d, i)=>{
    if (n === nebula?.tree.root) return;
    
    if (prevD < d) pos.z += d - prevD
    else if (prevD === d) pos.y++;
    else pos.x += prevD - d
    
    nodePoses.push({ node: n, pos: pos })
    prevD = d;
  })
  
  pos.x += pos.y;
  pos.z += pos.y;
  pos.y = 0;
  
  const size = Math.ceil(Math.max(pos.x/2, pos.z/2, Math.abs(pos.x - pos.z))) + 1;
  setGrid(size)
  
  nodePoses.forEach(v => {
    grid.at(v.pos)
  })
  
  //
  p.background("#aaaaaa")

  canvas.children.forEach((c)=>{
    tour(c, 0, 0, (o)=>{
      o.render()
    })
  })
}