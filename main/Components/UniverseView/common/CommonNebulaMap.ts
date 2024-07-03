import { btn, canvas, div, slider, span, ul } from "@/funcObject";
import { UniverseMap, UniverseMapInfo } from "./universeMap";
import { Universe } from "../../../data/components/Universe";
import { CommonNebula, Data, Nebula } from "../../../data/Data";
import "./CommonNebulaMap.css"
import { Picker } from "./Picker";
import { U, engine } from "@/engine";
import { Relation } from "../../../data/components/Relation";
import { range } from "@/utils/utils";

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
type UniverseInspector = "relation" | "hex";

export const UniverseMiniMap = (info:{data: Data}) => {
  return canvas()()
}
export const UniverseLocalList = (info:{data: Data}) => {
  return ul()()
}
export const UniverseMover = (info:{selection: {nebula?:Nebula}, data:Data}) => {
  let target:Nebula | undefined;

  function getNebulaPosition(){
    for (const u of info.data.universes.all()){
      for (const nl of u.nebulaLocations){
        if (nl.nebula === target){
          return `x: ${nl.worldPos.x}, y: ${nl.worldPos.y}`
        }
      }
    }
    return "x: -, y: -"
  }

  return div()([
    div({className: U(() => target ? "exist-target" : "")})(() => target?.name ?? "-"),
    btn({onclick: () => target = info.selection.nebula})("load"),
    div()([
      div()(getNebulaPosition),
      div()("=>"),
      div()(() => `x: -, y: -`)
    ])
  ])
}
export const NebulaExchanger = (info:{selection: {universe?:Universe, nebula?:Nebula}}) => {
  let from:Nebula | undefined;
  let to:Universe | undefined;

  return div()([
    div()(() => from?.name ?? "-"),
    btn({onclick: () => from = info.selection.nebula})("load"),
    div()(() => to?.name ?? "-")
  ])
}
export const RelationEditor = (info:{relation?: Relation}) => {
  return div()(
    () => info.relation ? info.relation.id.toString() : "No Selection of Relation"
  )
}
export const CommonNebulaMap = (info:CommonNebulaMapInfo) => {
  const {universeMap, selection, data} = info;
  
  const relationEditorInfo = {
    relation: undefined as Relation | undefined
  }

  const popupWindows = {
    miniMap: UniverseMiniMap(info),
    localList: UniverseLocalList(info)
  }
  const toolWindows = {
    move: UniverseMover({selection: info.selection, data: info.data}),
    emigrate: NebulaExchanger({selection: info.selection})
  }
  const inspectorWindows = {
    relation: RelationEditor(relationEditorInfo),
    hex: div()() //TODO: UniverseModel
  }
  
  let isInputtingChanger = [false, false];
  let tool:NebulaMapTool = "select"
  let popup:MapPopup = "";
  let inspector:UniverseInspector = "relation"
  let holdingRelation:{
    mainTree?: CommonNebula,
    secondTree?: CommonNebula
  } | undefined;

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

  const relationMarkPairs = new Array<{element: HTMLElement, info:{relation?:Relation}}>()
  const relationAdder = div({class: "relation-adder", onclick: () => {
    holdingRelation = {}
  }})("+")

  function relationMark(info:{relation?:Relation}){
    function onMarkClick(){
      inspector = "relation"
      relationEditorInfo.relation = info.relation;
    }
    return div({class: "relation-mark"})([
      div({class: "relation-mark-background", onclick: onMarkClick})(),
      div({class: "relation-mark-id"})(() => info.relation?.id.toString() ?? "")
    ])
  }
  function relationMarkBox(){
    if (!selection.universe) return [] as HTMLElement[];

    const relations = selection.universe.relations
    
    if (relations.length < relationMarkPairs.length){
      relationMarkPairs.splice(0, relationMarkPairs.length - relations.length);
    }
    else if (relations.length > relationMarkPairs.length){
      relationMarkPairs.push(
        ...range(relations.length - relationMarkPairs.length)
           .map(() => {
            const info = {};
            
            return ({
            element: relationMark(info),
            info: info
          })
        })
      )
    }

    for (let i = 0; i < relations.length; i++) {
      relationMarkPairs[i].info.relation = relations[i]
    }

    return [
      ...relationMarkPairs.map(rp => rp.element), 
      relationAdder
    ];
  }
  const relationProvider = [
    div()(() => `main: ${holdingRelation?.mainTree?.name ?? "-"}`),
    btn({onclick: () => {
      if (!holdingRelation) return;
      if (!(selection.nebula instanceof CommonNebula)) return;
      holdingRelation.mainTree = selection.nebula
    }})("load"),
    div()(() => `second: ${holdingRelation?.secondTree?.name ?? "-"}`),
    btn({onclick: () => {
      if (!holdingRelation) return;
      if (!(selection.nebula instanceof CommonNebula)) return;
      holdingRelation.secondTree = selection.nebula
    }})("load"),
    btn({onclick: () => {
      if (!selection.universe) return;
      if (!holdingRelation?.mainTree) return;
      if (!holdingRelation?.secondTree) return;
      const relation = data.relations.add(new Relation({
        mainTree: holdingRelation.mainTree,
        secondTree: holdingRelation.secondTree  
      }))
      selection.universe.relations.push(relation)
      holdingRelation = undefined
    }})("OK")
  ]
  function relationDefaultInfoReceiver(){
    if (!holdingRelation) return [] as HTMLElement[];
    return relationProvider
  }
  return div({class: "common-nebula-map"})([
    div({class: "universe-title"})(() => selection.universe?.name ?? ""),
    div({class: "relation-mark-box"})(relationMarkBox),
    div({class: "relation-default-info-receiver"})(relationDefaultInfoReceiver),
    div({class: "main"})([
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
        },
        value: U(s => isInputtingChanger[0] ? s.value : `${universeMap.viewPoint.x}`),
        min: U(s => Math.max(0, isInputtingChanger[0] ? Number(s.min) : universeMap.viewPoint.x - 8).toString()),
        max: U(s => isInputtingChanger[0] ? s.max : `${universeMap.viewPoint.x + 8}`)
      }),
      slider({
        class: "view-point-changer-y", 
        oninput: e => {
          isInputtingChanger[1] = true;
          universeMap.viewPoint.y = Number((<HTMLInputElement>e.target).value)
        },
        onmouseup: () => {
          isInputtingChanger[1] = false;
        }, 
        value: U(s => isInputtingChanger[1] ? s.value : `${universeMap.viewPoint.y}`),
        min: U(s => Math.max(0, isInputtingChanger[1] ? Number(s.min) : universeMap.viewPoint.y - 8).toString()),
        max: U(s => isInputtingChanger[1] ? s.max : `${universeMap.viewPoint.y + 8}`),
      })
    ]),
    div()(() => `x: ${universeMap.viewPoint.x} y: ${universeMap.viewPoint.y}`),
    div({class: "bottom-bar"})([
      div({class: "tool-box switch-box"})([
        btn({
          className: U(() => toolClass("select")),
          onclick: () => tool = "select"
        })("select"),
        btn({onclick: () => tool = "move", className: U(() => toolClass("move"))})("move"),
        btn({onclick: () => tool = "emigrate", className: U(() => toolClass("emigrate"))})("emigrate"),
        btn({onclick: () => tool = "addRelation", className: U(() => toolClass("addRelation"))})("add relation")
      ]),
      div({class: "instant-button-box switch-box"})([
        btn({onclick: () => popup = "miniMap", className: U(() => popupButtonClass("miniMap"))})("Mini map"),
        btn({onclick: () => popup = "localList", className: U(() => popupButtonClass("localList"))})("Local list")
      ])
    ]),
    div({class: "tool-window-box"})(() => {
      switch(tool){
        case "select": return [];
        case "move": return [toolWindows.move];
        case "emigrate": return [toolWindows.emigrate];
        case "addRelation": return [];
      }
    }),
    div({class: "inspector-box switch-box"})([
      btn({onclick: () => inspector = "relation", className: U(() => inspectorClass("relation"))})("Relation"),
      btn({onclick: () => inspector = "hex", className: U(() => inspectorClass("hex"))})("Hex")
    ]),
    div({class: "inspector-window"})(() => [inspectorWindows[inspector]])
  ]);
};
