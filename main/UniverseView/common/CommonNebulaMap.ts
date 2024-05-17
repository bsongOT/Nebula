import { btn, div, slider, span } from "@/funcObject";
import { UniverseMap, UniverseMapInfo } from "./universeMap/universeMap";
import { Universe } from "../../data/components/Universe";
import { Data, Nebula } from "../../data/Data";
import { DataCollection } from "../../data/DataCollection";

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
  return div()([
    UniverseMap(universeMap, selection, data),
    slider({
      class: "view-point-changer-x", 
      onchange: e => universeMap.viewPoint.x = Number((<HTMLInputElement>e.target).value)}, {
      value: s => s === document.activeElement ? s.value : `${universeMap.viewPoint.x}`,
      min: s => s === document.activeElement ? s.min : `${universeMap.viewPoint.x - 8}`,
      max: s => s === document.activeElement ? s.max : `${universeMap.viewPoint.x + 8}`
    }),
    slider({
      class: "view-point-changer-y", 
      onchange: e => universeMap.viewPoint.y = Number((<HTMLInputElement>e.target).value)}, {
      value: s => s === document.activeElement ? s.value : `${universeMap.viewPoint.y}`,
      min: s => s === document.activeElement ? s.min : `${universeMap.viewPoint.y - 8}`,
      max: s => s === document.activeElement ? s.max : `${universeMap.viewPoint.y + 8}`,
    }),
    span({}, {innerText: () => `x: ${universeMap.viewPoint.x} y: ${universeMap.viewPoint.y}`})(""),
    div()([
      btn()("Mini map"),
      btn()("Local list"),
      btn()("Relations"),
      btn()("Hex")
    ])
  ]);
};
