import { btn, canvas, div, inputText, slider, span, ul } from "@/funcObject";
import { UniverseMap, UniverseMapInfo } from "./universeMap";
import { Universe } from "../../data/components/Universe";
import { Data, Nebula } from "../../data/Data";
import "./CommonNebulaMap.css"
import { Picker } from "./Picker";
import { U, engine } from "@/engine";
import { Relation } from "../../data/components/Relation";
import { range } from "@/utils/utils";
import context from "../../context";
import { ListSelector } from "../../ListSelector/ListSelector";
import { gridify } from "@/data-structure/utils";
import { P, H } from "@/utils/math/coord-system";
import { StarTile } from "../NebulaPage/NebulaModel/StarTile";
import { HexGrid } from "@/data-structure/hexgrid";

export type CommonNebulaMapInfo = {
  universeMap: UniverseMapInfo,
}
const svgNS = "http://www.w3.org/2000/svg";
const Hexagon = (center: [number, number], side:number) => {
  const poly = document.createElementNS(svgNS, "polygon");
  const points = [
    [center[0], center[1] - side],
    [center[0] + 0.866 * side, center[1] - side / 2],
    [center[0] + 0.866 * side, center[1] + side / 2],
    [center[0], center[1] + side],
    [center[0] - 0.866 * side, center[1] + side / 2],
    [center[0] - 0.866 * side, center[1] - side / 2],
  ]
  poly.setAttribute("points", points.join(" "));
  poly.setAttribute("fill", "red");
  return poly;
}  
const UniverseHexGround = () => {
  const cv = document.createElementNS(svgNS, "svg");
  cv.style.width = '400px';
  cv.style.height = '400px';
  cv.style.border = "1px solid black";
  cv.style.marginTop = "50px";

  const canvasCenter = P(1, 1).scale(200);

  console.log(canvasCenter)
  for (const pos of new HexGrid(H(8, 8, 8)).range){
    const coord = pos.sub(H(7,0,7)).toCoord(380/(15 * 1.732)).add(canvasCenter)
    cv.append(Hexagon([coord.x, coord.y], 380/(15 * 1.732)));
  }

  engine.updater.register(() => {
    if (!context.selection.universe) return;
    
    for (const neb of context.selection.universe.nebulaLocations){
      const grid = gridify(neb.nebula.tree);
      const size = grid.size.x;
      const pivot = H(1, 0, 1).scale(size - 1);
    
      for (const pos of grid.range) {
        const content = grid.at(pos);
        const coord = pos.sub(pivot).toCoord(20).add(canvasCenter);
      }
    }
  })
  
  return cv as any as HTMLElement;
}
export const UniverseMiniMap = (info:{}) => {
  return canvas()()
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
  const universeMap = info.universeMap;
  
  const relationEditorInfo = {
    relation: undefined as Relation | undefined
  }
  
  let isInputtingChanger = [false, false];
  let holdingRelation:{
    mainTree?: Nebula,
    secondTree?: Nebula
  } | undefined;
  let selectedRelation = undefined as Relation | undefined;

  const relationMarkPairs = new Array<{element: HTMLElement, info:{relation?:Relation}}>()
  const relationAdder = div({class: "relation-adder", onclick: () => {
    holdingRelation = {}
  }})("+")

  function relationMark(info:{relation?:Relation}){
    function onMarkClick(){
      relationEditorInfo.relation = info.relation;
    }
    return div({class: "relation-mark"})([
      div({class: "relation-mark-background", onclick: onMarkClick})(),
      div({class: "relation-mark-id"})(() => info.relation?.id.toString() ?? "")
    ])
  }
  function relationMarkBox(){
    if (!context.selection.universe) return [] as HTMLElement[];

    const relations = context.selection.universe.relations
    
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
      holdingRelation.mainTree = context.selection.nebula
    }})("load"),
    div()(() => `second: ${holdingRelation?.secondTree?.name ?? "-"}`),
    btn({onclick: () => {
      if (!holdingRelation) return;
      holdingRelation.secondTree = context.selection.nebula
    }})("load"),
    btn({onclick: () => {
      if (!context.selection.universe) return;
      if (!holdingRelation?.mainTree) return;
      if (!holdingRelation?.secondTree) return;
      const relation = context.data.relations.add(new Relation({
        mainTree: holdingRelation.mainTree,
        secondTree: holdingRelation.secondTree  
      }))
      context.selection.universe.relations.push(relation)
      holdingRelation = undefined
    }})("OK")
  ]
  function relationDefaultInfoReceiver(){
    if (!holdingRelation) return [] as HTMLElement[];
    return relationProvider
  }

  const universeHexGround = UniverseHexGround()
  const universeList = [
    ListSelector({
      datas: context.data.universes,
      componentBuilder: (info) => div({onclick: () => context.selection.universe = info.data})(() => info.data.name),
      filter: (univ, search) => univ.name.includes(search)
    }),
    div()([
      inputText({type: "checkbox"})(),
      span()("local")
    ])
  ];

  return div({class: "common-nebula-map main-page"})([
    div({class: "universe-title"})(() => context.selection.universe?.name ?? ""),
    div({class: "relation-mark-box"})(relationMarkBox),
    div({class: "relation-default-info-receiver"})(relationDefaultInfoReceiver),
    btn({class: "zoom-button"})("zoom"),
    UniverseMap(universeMap),
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
    }),
    div()(() => `x: ${universeMap.viewPoint.x} y: ${universeMap.viewPoint.y}`),
    div({class: "side"})(() => {
      if (!context.selection.universe) return universeList
      if (!selectedRelation) return [universeHexGround];
      return [RelationEditor(relationEditorInfo)];
    })
  ]);
};