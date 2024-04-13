import { upperMenu} from "../../custom-object/"
import {data} from "../../data/Data"
import "./menu.css"
import { body, btn, div, span, ul, canvas } from "@/funcObject";
import { selli } from "@/objects/list/selli";
import { UniverseMap } from "./universeMap";
import { Coord } from "@/coord-system";
import { UniverseList } from "./universeList";

const memento = {
  universeMap: {
    size: 16,
    universes: data.universes,
    viewPoint: new Coord(0, 0),
    selection: undefined,
    selectedNebula: undefined
  },
  universeList: {
    universes: data.universes
  }
}

const layout = {
  map: new UniverseMap(memento.universeMap),
  minimap: canvas({width: 400})(),
  list: new UniverseList(memento.universeList),
  nebulaEditor: {
    
  }
}

const switchGroups = [
  {
    switch: selli(span()("World")),
    element: layout.map.element
  },{
    switch: selli(span()("Minimap")),
    element: layout.minimap
  }
]

for (const sg of switchGroups){
  sg.switch.onclick = () => {
    for (const s of switchGroups)
      s.element.classList.remove("current-window")

    sg.element.classList.add("current-window")
  }
}

body(
  upperMenu(),
  div({class: "universe"})(
    btn({onclick: () => data.addUniverse()})("New Universe"),
    btn({onclick: () => data.addNebula("Untitled", data.universes.get(Number(layout.list.element.querySelector<HTMLElement>(".selected")!.innerText))!)})("New Nebula"),
    div()(span()(`x: 0, y: 0`)),
    div()(
      ul({class: "switch-box"})(
        ...switchGroups.map(sg => sg.switch)
      ),
      div({class: "universe-window-box"})(
        ...switchGroups.map(sg => sg.element)
      )
    ),
    layout.list.element
  ),

);

switchGroups[0].switch.click()