import { btn, div, slider, span } from "@/funcObject";
import { UniverseMap, UniverseMapInfo } from "./universeMap";
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
  
  let isInputtingChanger = [false, false];
  
  return div({class: "common-nebula-map"})([
    UniverseMap(universeMap, selection, data),
    slider({
      class: "view-point-changer-x", 
      oninput: e => {
        isInputtingChanger[0] = true;
        universeMap.viewPoint.x = Number((<HTMLInputElement>e.target).value)
      },
      onmouseup: () => {
        isInputtingChanger[0] = false;
      }}, {
      value: s => isInputtingChanger[0] ? s.value : `${universeMap.viewPoint.x}`,
      min: s => Math.max(0, isInputtingChanger[0] ? Number(s.min) : universeMap.viewPoint.x - 8).toString(),
      max: s => isInputtingChanger[0] ? s.max : `${universeMap.viewPoint.x + 8}`
    }),
    slider({
      class: "view-point-changer-y", 
      oninput: e => {
        isInputtingChanger[1] = true;
        universeMap.viewPoint.y = Number((<HTMLInputElement>e.target).value)
      },
      onmouseup: () => {
        isInputtingChanger[1] = false;
      }}, {
      value: s => isInputtingChanger[1] ? s.value : `${universeMap.viewPoint.y}`,
      min: s => Math.max(0, isInputtingChanger[1] ? Number(s.min) : universeMap.viewPoint.y - 8).toString(),
      max: s => isInputtingChanger[1] ? s.max : `${universeMap.viewPoint.y + 8}`,
    }),
    div()(() => `x: ${universeMap.viewPoint.x} y: ${universeMap.viewPoint.y}`),
    div({class: "switch-box"})([
      btn()("Mini map"),
      btn()("Local list"),
      btn()("Relations"),
      btn()("Hex")
    ])
  ]);
};
