import { CanvasObject, Container, Hexagon} from "@/objects/CanvasObject"
import { StarTile } from "../../custom-object"
import {Coord, HexCoord} from "@/coord-system"
import {HexWorld} from "@/data-structure/hexworld"
import { body, btn, canvas, div, inputText, li, span } from "@/funcObject"
import { treeList } from "../../custom-object/StarListContainer/StarList"
import { Content } from "../../data/components/Content"
import { Tree, TreeNode } from "@/data-structure/tree"
import { data } from "../../data/Data"

const id = Number(new URL(location.search).searchParams.get("id"))
if (!id || isNaN(id)) throw "error"

const nebula = data.nebulas.get(id);
if (!nebula) throw "error"

const tree = nebula.tree;
let selection:TreeNode<Content>|undefined;

const starList = treeList(tree, (content, i) => div({onclick:()=>selection = tree.at(i)})(span()(content.title)))
const effectBox = new Container();
const tileBox = new Container();

const cv = canvas()(
  effectBox,
  tileBox
)

body(
  div()(
    starList,
    div({class: "arrow-button-container"})(
      btn({class: "up-arrow", onclick: updent})("↑"),
      btn({class: "left-arrow", onclick: outdent})("←"),
      btn({class: "down-arrow", onclick: downdent})("↓"),
      btn({class: "right-arrow", onclick: indent})("→")
    )
  ),
  cv
)

function updent(){
  const left = selection?.leftFriend;
  if (!left) return;
  tree.insertAsLeftFriend(left, selection!)
}

function outdent(){
  const parent = selection?.parent;
  if (!parent) return;
  tree.insertAsRightFriend(parent, selection!)
}

function downdent(){
  const right = selection?.rightFriend;
  if (!right) return;
  tree.insertAsRightFriend(right, selection!)
}

function indent(){
  const left = selection?.leftFriend;
  if (!left) return;
  tree.insert(selection!, left)
}

const dropGrid = (grid:HexWorld<Content>) => {
  tileBox.empty()
  const size = grid.size.x;
  const pivot = new HexCoord(size-1,0,size-1)
  let pos = new HexCoord(0,0,0)

  for (let i = 0; i < grid.area; i++) {
    const content = grid.at(pos);
    const tile = content ? new StarTile("none", content) : new Hexagon()
    const coord = pos.sub(pivot).toCoord(20).add(new Coord(1,1).scale(cv.scrollWidth/2))

    tile.form
      .moveAt(coord.x, coord.y)
      .setColor("#ffffff")
      .setSide(20)

    tileBox.adopt(tile)
    pos = grid.next(pos);
  }
}
const update = () => {
  let pos = new HexCoord(0,-1,0)
  let prevD = 0;

  const grid = new HexWorld<Content>()
  
  tree.tourNode(tree.root, (n, d)=>{
    if (!d) return;
    if (prevD < d) pos.z += d - prevD
    else if (prevD === d) pos.y++;
    else pos.x += prevD - d
    
    grid.setVal(pos, n.data)
    prevD = d;
  })

  dropGrid(grid)
}