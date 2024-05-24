import { btn, canvas, div, slider, span, ul } from "@/funcObject";
import { UniverseMap, UniverseMapInfo } from "./universeMap";
import { Universe } from "../../data/components/Universe";
import { Data, Nebula } from "../../data/Data";
import "./CommonNebulaMap.css"
import { Picker } from "./Picker";

export type CommonNebulaMapInfo = {
  universeMap: UniverseMapInfo,
  selection: {
    universe?: Universe,
    nebula?: Nebula
  },
  data: Data
}
type NebulaMapTool = "select" | "move" | "emigrate" | "addRelation";
type MapPopup = "" | "miniMap" | "localList";
type UniverseInspector = "relations" | "hex";

export const UniverseMiniMap = (info:{data: Data}) => {
  return canvas()()
}
export const UniverseLocalList = (info:{data: Data}) => {
  return ul()()
}
export const CommonNebulaMap = (info:CommonNebulaMapInfo) => {
  const {universeMap, selection, data} = info;
  const popupWindows = {
    miniMap: UniverseMiniMap(info),
    localList: UniverseLocalList(info)
  }
  
  let isInputtingChanger = [false, false];
  let tool:NebulaMapTool = "select"
  let popup:MapPopup = "";
  let inspector:UniverseInspector = "relations"

  function toolClass(toolName:NebulaMapTool){
    if (tool === toolName) return "selected"
    return ""
  }
  function popupButtonClass(popupName:MapPopup){
    if (popup === popupName) return "selected"
    return ""
  }
  function inspectorClass(inspectorName:UniverseInspector){
    if (inspector === inspectorName) return "selected"
    return ""
  }
  function popupContainer(){
    if (popup === "") return [] as HTMLElement[];
    return [popupWindows[popup]];
  }
  
  return div({class: "common-nebula-map"})([
    div({class: "universe-title"})(() => selection.universe?.name ?? ""),
    div({class: "relation-mark-box"})(
      () => selection.universe?.relations.map(
        r => div({class: "relation-mark"})(r.id.toString())
      ) ?? []
    ),
    div()([
      div({class: "universe-map-box"})([
        UniverseMap(universeMap, selection, data),
        Picker(info.universeMap, data),
        div({class: "universe-map-popup"})(popupContainer)
      ]),
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
      })
    ]),
    div()(() => `x: ${universeMap.viewPoint.x} y: ${universeMap.viewPoint.y}`),
    div({class: "bottom-bar"})([
      div({class: "tool-box switch-box"})([
        btn({onclick: () => tool = "select"}, {className: () => toolClass("select")})("select"),
        btn({onclick: () => tool = "move"}, {className: () => toolClass("move")})("move"),
        btn({onclick: () => tool = "emigrate"}, {className: () => toolClass("emigrate")})("emigrate"),
        btn({onclick: () => tool = "addRelation"}, {className: () => toolClass("addRelation")})("add relation")
      ]),
      div({class: "instant-button-box switch-box"})([
        btn({onclick: () => popup = "miniMap"}, {className: () => popupButtonClass("miniMap")})("Mini map"),
        btn({onclick: () => popup = "localList"}, {className: () => popupButtonClass("localList")})("Local list")
      ])
    ]),
    div({class: "inspector-box switch-box"})([
      btn({onclick: () => inspector = "relations"}, {className: () => inspectorClass("relations")})("Relations"),
      btn({onclick: () => inspector = "hex"}, {className: () => inspectorClass("hex")})("Hex")
    ])
  ]);
};
