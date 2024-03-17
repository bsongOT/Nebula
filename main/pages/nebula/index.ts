import { WCanvas, WCanvasContainer, WHexagon} from "@/objects/CanvasObject"
import { StarTile } from "../../custom-object"
import {Coord, HexCoord} from "@/coord-system"
import {HexWorld} from "@/data-structure/hexworld"
import {selectedNebula, data} from "../../data/Data"
import { StarLeafItem } from "../../custom-object/StarListContainer/StarLeafItem"
import { body, btn, canvas, div, inputText, span } from "@/funcObject"
import { StarList } from "../../custom-object/StarListContainer/StarList"

const nebula = selectedNebula;
if (!nebula) throw "error"

let grid = new HexWorld<StarLeafItem>()

const starList = new StarList(nebula)
const effectBox = new WCanvasContainer();
const tileBox = new WCanvasContainer();
const cv = canvas()(
  effectBox,
  tileBox,
  //update launcher
)

body(
  div()(
    div({class: "arrow-button-container"})(
      btn({class: "up-arrow", onclick: ()=>starList.selection.updent()})("↑"),
      btn({class: "left-arrow", onclick: ()=>starList.selection.outdent()})("←"),
      btn({class: "down-arrow", onclick: ()=>starList.selection.downdent()})("↓"),
      btn()("→")
    )
  ),
  cv
)

const dropGrid = () => {
  tileBox.family.empty()
  const size = grid.size.x;
  const pivot = new HexCoord(size-1,0,size-1)
  let pos = new HexCoord(0,0,0)

  for (let i = 0; i < grid.area; i++) {
    const item = grid.at(pos);
    const tile = item ? new StarTile(item) : new WHexagon()
    const coord = pos.sub(pivot).toCoord(20).add(new Coord(1,1).scale(cv.scrollWidth/2))

    tile.form
      .moveAt(coord.x, coord.y)
      .setColor("#ffffff")
      .setSide(20)

    tileBox.family.adopt(tile)
    pos = grid.next(pos);
  }
}
const update = () => {
  let pos = new HexCoord(0,-1,0)
  let prevD = 0;

  grid = new HexWorld()
  
  starList.tree.tourNode(starList.tree.root, (n, d)=>{
    if (!d) return;
    if (prevD < d) pos.z += d - prevD
    else if (prevD === d) pos.y++;
    else pos.x += prevD - d
    
    grid.setVal(pos, n.data)
    prevD = d;
  })

  dropGrid()
}