import { btn, div, slider, span } from "@/funcObject";
import { UniverseMap, UniverseMapInfo } from "./universeMap/universeMap";
import { Universe } from "../../data/components/Universe";
import { Data, Nebula } from "../../data/Data";
import "./CommonNebulaMap.css"

export type CommonNebulaMapInfo = {
  universeMap: UniverseMapInfo,
  selection: {
    universe?: Universe,
    nebula?: Nebula
  },
  data: Data
}
export const CommonNebulaMap = (info:CommonNebulaMapInfo) => {
  const {universeMap, selection, data} = info;
  
  return div({class: "common-nebula-map"})([
    UniverseMap(universeMap, selection, data),
    slider({
      class: "view-point-changer-x", 
      oninput: e => universeMap.viewPoint.x = Number((<HTMLInputElement>e.target).value)}, {
      value: s => s === document.activeElement ? s.value : `${universeMap.viewPoint.x}`,
      min: s => s === document.activeElement ? s.min : `${universeMap.viewPoint.x - 8}`,
      max: s => s === document.activeElement ? s.max : `${universeMap.viewPoint.x + 8}`
    }),
    slider({
      class: "view-point-changer-y", 
      oninput: e => universeMap.viewPoint.y = Number((<HTMLInputElement>e.target).value)}, {
      value: s => s === document.activeElement ? s.value : `${universeMap.viewPoint.y}`,
      min: s => s === document.activeElement ? s.min : `${universeMap.viewPoint.y - 8}`,
      max: s => s === document.activeElement ? s.max : `${universeMap.viewPoint.y + 8}`,
    }),
    div()(() => `x: ${universeMap.viewPoint.x} y: ${universeMap.viewPoint.y}`),
    div()([
      btn()("Mini map"),
      btn()("Local list"),
      btn()("Relations"),
      btn()("Hex")
    ])
  ]);
};
