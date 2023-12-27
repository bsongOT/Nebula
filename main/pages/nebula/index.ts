import {
  WCanvas,
  CanvasContainer,
  Hexagon
} 
from "@/objects/CanvasObject"
import {
  UpperMenu,
  ContentsContainer,
  StarTile,
  StarListContainer,
  ContentsList
} 
from "../../custom-object"
import {Coord, HexCoord} from "@/coord-system"
import {HexWorld} from "@/data-structure/hexworld"
import {selectedNebula, data} from "../../data/Data"
import { PolygonForm } from "@/factors/forms/PolygonForm"
import { InputText, Radio, RadioBox } from "@/objects/input/"
import { Popup } from "@/objects/Popup"
import { StarLeafItem } from "../../custom-object/StarListContainer/StarLeafItem"
import { WBody, WButton, WContainer } from "@/objects"

let grid = new HexWorld<StarLeafItem>();
let nebula = selectedNebula;
let clist:ContentsList;
let slc:WContainer;
let popup:Popup;
let selectDisplay:WButton;
let canvas:WCanvas;
let effectBox:CanvasContainer;
let tileBox:CanvasContainer;

if (!nebula) throw "Error";

const titleInput = 
  new InputText()
    .setValue(nebula.name).event
    .onchange(()=>{
      nebula!.name = titleInput.value;
    })
const addInTreeButton = 
  new WButton("+").event
  .onclick(()=>starList.add(clist.selection.value))
    

new WBody([
  new UpperMenu(),
  new RadioBox([
    new Radio("kind").label("Story"),
    new Radio("kind").label("Type")
  ]),
  titleInput,
  popup = new Popup([
    selectDisplay = new WButton("*** Not Selected ***"),
    new ContentsContainer(data.contents).useComponents(({list})=>{
      clist = list!;
      list!.event.onselect(()=>{
        if (!list?.selection?.value) return;
        popup.hide()
        selectDisplay.value = list.selection.value.title;
      })
    })
  ]),
  addInTreeButton,
  slc = StarListContainer(nebula),
  canvas = new WCanvas(
  window.innerWidth, window.innerWidth,
  [
    effectBox = new CanvasContainer(),
    tileBox = new CanvasContainer(),
    (()=>{
      const u = new CanvasContainer()
      u.update = ()=>{
        update();
        return u;
      }
      return u;
    })()
  ])
])

const dropGrid = () => {
  tileBox.family.empty()
  const size = grid.size.x;
  const pivot = new HexCoord(size-1,0,size-1)
  let pos = new HexCoord(0,0,0)

  for (let i = 0; i < grid.area; i++) {
    const item = grid.at(pos);

    if (item)
      tileBox.family.adopt(
        new StarTile(item, new PolygonForm(
          pos.sub(pivot).toCoord(20).add(new Coord(1,1).scale(canvas.width/2)),
          20, "#ffffff"
        ))
      )
    else 
      tileBox.family.adopt(
        new Hexagon(new PolygonForm(
          pos.sub(pivot).toCoord(20).add(new Coord(1,1).scale(canvas.width/2)),
          20, "#ffffff"
        ))
      )

    pos = grid.next(pos);
  }
}
const update = () => {
  let pos = new HexCoord(0,-1,0)
  let prevD = 0;

  grid = new HexWorld()
  
  slc.list.tree.tourNode((n, d)=>{
    if (prevD < d) pos.z += d - prevD
    else if (prevD === d) pos.y++;
    else pos.x += prevD - d
    
    grid.setVal(pos, n.data)
    prevD = d;
  })

  dropGrid()
}