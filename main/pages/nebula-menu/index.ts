import {Content, Nebula, data} from "../../data/Data"
import "./menu.css"
import { body, btn, div, span, ul, canvas } from "@/funcObject";
import { selli } from "@/objects/UI/list/selli";
import { UniverseMap } from "../../components/universeMap/universeMap";
import { P } from "@/utils/math/coord-system";
import { UniverseList } from "../../components/universeList";
import { Universe } from "../../data/components/Universe";
import { StarTree } from "../nebula/StarTree";

const memento = {
  universeMap: {
    size: 16,
    viewPoint: P(0, 0)
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
  list: new UniverseList(memento.data, memento.selection),
}

const changeView = (view:HTMLElement) => {
  layout.windowBox.innerHTML = "";
  layout.windowBox.append(view)
}

const universeWindow = div({class: "universe"})(
  div()(
    ul({class: "switch-box"})(
      selli({onclick: () => changeView(layout.map.element)})(span()("World")),
      selli({onclick: () => changeView(layout.minimap)})(span()("Minimap")),
      selli({onclick: () => changeView(layout.list.element)})(span()("List"))
    ),
    layout.windowBox
  ),
  span()("x: 0, y: 0")
)

body(
  div()(
    btn()("Universe"),
    btn()("Nebula"),
    btn()("Content")
  ),
  div({class: "main-view"})(

  ),
  new StarTree(memento.data, memento.selection).element
);