import { upperMenu} from "../../global objects"
import {data} from "../../data/Data"
import "./menu.css"
import { body, btn, div, span, ul, canvas } from "@/funcObject";
import { selli } from "@/objects/UI/list/selli";
import { UniverseMap } from "./universeMap";
import { P } from "@/utils/math/coord-system";
import { UniverseList } from "./universeList";
import { Universe } from "../../data/components/Universe";
import { StarTree } from "../nebula/StarTree";
import { NebulaViewer } from "./nebula-viewer/nebulaViewer";

const memento = {
  universeMap: {
    size: 16,
    viewPoint: P(0, 0)
  },
  data: {
    universes: data.universes,
    relations: data.relations,
    nebulas: data.nebulas,
    contents: data.contents,
    dusts: data.dusts
  },
  selection: {
    universe: undefined as Universe | undefined,
    nebula: undefined,
    content: undefined
  }
}

const layout = {
  map: new UniverseMap(memento.universeMap, memento.selection, memento.data),
  minimap: canvas({width: 400})(),
  nebulaViewer: new NebulaViewer(),
  list: new UniverseList(memento.data, memento.selection),
}

const switchGroups = [
  {
    switch: selli()(span()("World")),
    element: layout.map.element
  },{
    switch: selli()(span()("Minimap")),
    element: layout.minimap
  },{
    switch: selli()(span()("Nebula")),
    element: layout.nebulaViewer.element
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
    btn({onclick: () => {
      const univ = memento.selection.universe;
      if(!univ) return;
      data.addNebula("Untitled", univ)
    }})("New Nebula"),
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
  div()(
    new StarTree(memento.data, memento.selection).element
  )
);

switchGroups[0].switch.click()