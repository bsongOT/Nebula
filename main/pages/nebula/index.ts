import { WCanvas, WCanvasContainer, WHexagon} from "@/objects/CanvasObject"
import { UpperMenu, StarTile, ContentsList } from "../../custom-object"
import {Coord, HexCoord} from "@/coord-system"
import {HexWorld} from "@/data-structure/hexworld"
import {selectedNebula, data} from "../../data/Data"
import { StarLeafItem } from "../../custom-object/StarListContainer/StarLeafItem"
import { body, btn, div, inputText, span } from "@/funcObject"
import { WRadio, WRadioBox } from "@/objects/input"
import { WPopup } from "@/objects/WPopup"
import { StarList } from "../../custom-object/StarListContainer/StarList"

const nebula = selectedNebula;
if (!nebula) throw "error"

let grid = new HexWorld<StarLeafItem>()

const list = new ContentsList(data).onselect(()=>popup.hide());
const starList = new StarList(nebula);
const popupBtn = btn("컨텐트 선택");
const popup = new WPopup(popupBtn, list)
const effectBox = new WCanvasContainer();
const tileBox = new WCanvasContainer();
const canvas = new WCanvas(window.innerWidth, window.innerWidth)
const titleInput = 
  inputText()
    .setValue(nebula.name)
    .onchange(()=>{
      nebula!.name = titleInput.value;
    })
const addInTreeButton = 
  btn("+").input
  .onclick(()=>starList.add(list.selection!.data!))
    

body(
  new UpperMenu(),
  new WRadioBox([
    new WRadio("kind").label("Story"),
    new WRadio("kind").label("Type")
  ]),
  titleInput,
  popupBtn,
  span("*** Nothing ***"),
  popup,
  addInTreeButton,
  div()(
    starList,
    div({class: "arrow-button-container"})(
      btn("↑")
        .class.add("up-arrow")
        .input.onclick(()=>starList.selection.updent()),
      btn("←")
        .class.add("left-arrow")
        .input.onclick(()=>starList.selection.outdent()),
      btn("↓")
        .class.add("down-arrow")
        .input.onclick(()=>starList.selection.downdent()),
      btn("→")
        .class.add("right-arrow")
        .input.onclick(()=>starList.selection.indent())
    )
  ),
  canvas.family.adoptAll([
    effectBox,
    tileBox,
    (()=>{
      const u = new WCanvasContainer()
      u.update = ()=>{
        update();
        return u;
      }
      return u;
    })()
  ])
)

const dropGrid = () => {
  tileBox.family.empty()
  const size = grid.size.x;
  const pivot = new HexCoord(size-1,0,size-1)
  let pos = new HexCoord(0,0,0)

  for (let i = 0; i < grid.area; i++) {
    const item = grid.at(pos);
    const tile = item ? new StarTile(item) : new WHexagon()
    const coord = pos.sub(pivot).toCoord(20).add(new Coord(1,1).scale(canvas.width/2))

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