import { upperMenu} from "../../global objects"
import {Content, Nebula, data} from "../../data/Data"
import "./menu.css"
import { body, btn, div, span, ul, canvas } from "@/funcObject";
import { selli } from "@/objects/UI/list/selli";
import { UniverseMap } from "../../components/universeMap/universeMap";
import { P } from "@/utils/math/coord-system";
import { UniverseList } from "../../components/universeList";
import { Universe } from "../../data/components/Universe";
import { StarTree } from "../nebula/StarTree";
import { NebulaViewer } from "../../components/nebula-viewer/nebulaViewer";

const memento = {
  universeMap: {
    size: 16,
    viewPoint: P(0, 0),
  },
  data: data,
  selection: {
    universe: undefined as Universe | undefined,
    nebula: undefined as Nebula | undefined,
    content: undefined as Content | undefined
  }
}

const layout = {
  windowBox: div({class: "universe-window-box"})(),
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

layout.windowBox.append(switchGroups[0].element)

for (const sg of switchGroups){
  sg.switch.onclick = () => {
    layout.windowBox.innerHTML = "";
    layout.windowBox.append(sg.element)
  }
}

body(
  upperMenu(),
  div({class: "universe"})(
    div()(
      ul({class: "switch-box"})(
        ...switchGroups.map(sg => sg.switch)
      ),
      layout.windowBox
    ),
    span()("x: 0, y: 0"),
    layout.list.element
  ),
  new StarTree(memento.data, memento.selection).element
);