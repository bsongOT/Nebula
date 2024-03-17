import { WCanvasContainer, WCanvas, WSquare } from "@/objects/CanvasObject/";
import { WRadio, WRadioBox } from "@/objects/input/";
import { nebulaSpaceSize } from "../../consts";
import {UpperMenu, upperMenu} from "../../custom-object/"
import {NebulaTile} from "../../custom-object/NebulaTile"
import {Nebula, data} from "../../data/Data"
import "../../styles/NebulaSpace.css"
import { emptyArr } from "@/utils/utils";
import { body, btn, canvas, div, inputText, span, table, td, tr } from "@/funcObject";
import { Universe } from "../../data/Universe";

const size = nebulaSpaceSize;
const map = universeMap()
const getCell = (x:number, y:number) => <HTMLElement>map.children[y].children[x]

class ElementUpdater {
  private list:(()=>void)[] = [];
  private updater?: NodeJS.Timeout
  public register(func:()=>void){
    this.list.push(func)
    if (this.updater) return;
    this.updater = setInterval(
      () => this.list.forEach(f => f()),
      100
    )
  }
}

const updater = new ElementUpdater();

let selectedUniverse:Universe|undefined;

function universeMap(){
  const map = table()()

  map.append(...Array(size).fill(0).map(_ => (
    tr()(
      ...Array(size).fill(0).map(_ => td()())
    )
  )))

  updater.register(updateMap)

  return map;
}

function updateMap(){
  for (const r of map.children){
    for(const cell of r.children){
      cell.className = ""
    }
  }
  for (const univ of data.universes.all()){
    for (const neb of univ.nebulaInfos){
      const [x, y] = [neb.worldPos.x, neb.worldPos.y]
      if (x < 0 || x >= size) continue;
      if (y < 0 || y >= size) continue;

      const cell = getCell(x, y)

      cell.onclick = () => showUniverse(univ)
      
      cell.style.background = "purple"

      if (univ.isIn(x - 1, y)) cell.style.borderLeft = "2px solid blue"
      if (univ.isIn(x + 1, y)) cell.style.borderRight = "2px solid blue"
      if (univ.isIn(x, y - 1)) cell.style.borderTop = "2px solid blue"
      if (univ.isIn(x, y + 1)) cell.style.borderBottom = "2px solid blue"
    }
  }
  if (selectedUniverse) showUniverse(selectedUniverse)
}

function showUniverse(universe:Universe){
  for (const r of map.children){
    for (const cell of r.children as HTMLCollectionOf<HTMLElement>){
      cell.classList.add("clear");
      cell.innerText = ""
    }
  }
  for (const neb of universe.nebulaInfos){
    const cell = getCell(neb.worldPos.x, neb.worldPos.y)
    cell.classList.remove("clear")
    cell.innerText = neb.nebula.name
  }
  map.classList.add("floating")
}

body(
  upperMenu(),
  btn({onclick: () => data.addUniverse()})("New Universe"),
  div({class: "nebula-space"})(
    btn()("<"),
    map,
    btn()(">")
  ),
  span()(`1 / ${data.getNebulaSpaceTotalPage()}`),
);