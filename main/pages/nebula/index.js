import {
  BodyObject,
  SelectMenu,
  Option,
  CanvasScreen,
  CanvasContainer,
  Line
} 
from "../../objects/index.js"
import {
  UpperMenu,
  ContentsContainer,
  Search, Filter, ContentsList,
  TOCContainer,
  TitleInput,
  AddInTreeButton,
  Tile
} 
from "../../custom-object/index.js"
import {Coord, HexCoord} from "../../utils/CoordConverter.js"
import {tour} from "../../utils/utils.js"
import {HexGrid} from "../../data-structure/hexgrid.js"
import {selectedNebula, contents} from "../../data/Data.js"

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

let grid = new HexGrid(6);
let nebula = selectedNebula;
let cc, ccs, ccf, ccl;
let toc;

const body = new BodyObject([
  new UpperMenu(),
  new TitleInput(nebula),
  new SelectMenu([
    new Option("flow"),
    new Option("type")
  ]),
  cc = new ContentsContainer(
    {contents: contents}, [
    ccs = new Search(()=>ccl.update()),
    ccf = new Filter(()=>ccl.update()),
    ccl = new ContentsList(contents, ccf, ccs)
  ]),
  toc = new TOCContainer(nebula),
  new AddInTreeButton(cc, toc)
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

  for (let i = 0; i < 2 * grid.size - 1; i++) {
    for (let j = grid.min(i); j < grid.max(i); j++) {
      const data = tileBox.adopt(new Tile(
        new HexCoord(i, 0, j).sub(pivot).toCoord(20).add(new Coord(p.width/2,p.height/2)),
        20, undefined, toc.panel
      ))
      grid.setVal(i, 0, j, data)
    }
  }
}
const update = () => {
  //data update
  
  let nodePoses = [];
  let pos = new HexCoord(0,-1,0)
  let prevD = 1;
  for (let t of tileBox.children){
    t.node = undefined;
  }
  tour(toc.panel, 0, 0, (n, d, i)=>{
    if (n === toc.panel) return;
    
    if (prevD < d) pos.five += d - prevD
    else if (prevD === d) pos.three++;
    else pos.one += prevD - d
    
    nodePoses.push({node: n, pos: {
        one: pos.one,
        three: pos.three,
        five: pos.five
      }
    })
    prevD = d;
  })
  
  pos.one += pos.three;
  pos.five += pos.three;
  pos.three = 0;
  
  const size = Math.ceil(Math.max(pos.one/2, pos.five/2, Math.abs(pos.one - pos.five))) + 1;
  setGrid(size)
  
  nodePoses.forEach(v => {
    const one = v.pos.one;
    const three = v.pos.three;
    const five = v.pos.five;
    
    grid.at(one, three, five).node = v.node
  })
  
  //
  p.background("#aaaaaa")

  canvas.children.forEach((c)=>{
    tour(c, 0, 0, (o)=>{
      o.render()
    })
  })
}