import {
  CanvasScreen,
  CanvasContainer,
  Hexagon
} 
from "@/objects/CanvasObject"
import {
  UpperMenu,
  ContentsContainer,
  TitleInput,
  AddInTreeButton,
  StarTile,
  StarListContainer
} 
from "../../custom-object"
import {Coord, HexCoord} from "@/coord-system"
import {HexWorld} from "@/data-structure/hexworld"
import {selectedNebula, data, Content} from "../../data/Data"
import { PolygonForm } from "@/infos/PolygonForm"
import { Radio, RadioBox } from "@/objects/input/"
import { Popup } from "@/objects/Popup"
import { StarLeafItem } from "../../custom-object/StarListContainer/StarLeafItem"
import { BodyObject, ButtonObject } from "@/objects"

let grid = new HexWorld<StarLeafItem>();
let nebula = selectedNebula;
let cc:ContentsContainer;
let slc:StarListContainer;
let adit:AddInTreeButton;
let popup:Popup;
let selectDisplay:ButtonObject;
let canvas:CanvasScreen;
let effectBox:CanvasContainer;
let tileBox:CanvasContainer;

if (!nebula) throw "Error";

new BodyObject([
  new UpperMenu(),
  new RadioBox([
    new Radio("kind").label("Story"),
    new Radio("kind").label("Type")
  ]),
  new TitleInput(nebula),
  popup = new Popup([
    selectDisplay = new ButtonObject("*** Not Selected ***"),
    cc = new ContentsContainer(data.contents)
              .onselect(()=>{
                popup.hide()
                selectDisplay.value = cc.selection.value.title;
              })
  ]),
  adit = new AddInTreeButton(),
  slc = new StarListContainer(nebula),
  canvas = new CanvasScreen(
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

adit.ready(cc,slc)

const dropGrid = () => {
  tileBox.empty()
  const size = grid.size.x;
  const pivot = new HexCoord(size-1,0,size-1)
  let pos = new HexCoord(0,0,0)

  for (let i = 0; i < grid.area; i++) {
    const item = grid.at(pos);

    if (item)
      tileBox.adopt(
        new StarTile(item, new PolygonForm(
          pos.sub(pivot).toCoord(20).add(new Coord(1,1).scale(canvas.width/2)),
          20, "#ffffff"
        ))
      )
    else 
      tileBox.adopt(
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