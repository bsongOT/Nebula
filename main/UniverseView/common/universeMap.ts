import { div, span, table, td, tr } from "@/funcObject";
import { NebulaLocation, Universe } from "../../data/components/Universe";
import { Coord, H, P } from "@/utils/math/coord-system";
import { CommonNebula, Data, Nebula } from "../../data/Data";
import "./universeMap.css"
import { engine } from "@/engine";
import { Picker } from "./Picker";

export type UniverseMapInfo = {
  size: number,
  viewPoint: Coord,
  pickedPosition?: Coord
}
type NebulaCellState = 
  "default" | "valid" | "clear" | 
  "selectedAsUniverse" | "selectedAsNebula" |
  "picked";
type NebulaCellInfo = {
  readonly position: Coord,
  selection: {
    universe?:Universe,
    nebula?:Nebula
  },
  location?: NebulaLocation,
  universe?: Universe,
  map: {
    size: number,
    pickedPosition?: Coord
  }
}

export function NebulaCell(info:NebulaCellInfo) {
  function state():NebulaCellState{
    if (info.universe && info.location) {
      if (!info.selection.universe) return "valid";
      if (info.selection.universe !== info.universe) return "clear"
      if (info.selection.nebula !== info.location.nebula) return "selectedAsUniverse"
            
      return "selectedAsNebula"
    }

    if (info.selection.universe) return "clear"
    if (info.map.pickedPosition &&
       info.position.eq(info.map.pickedPosition)) return "picked"

    return "default"
  }

  function calculatePosition(){
    if (!info.universe || !info.location) return {transform: ""};
    if (info.universe !== info.selection.universe) return {transform: ""};

    const size = info.map.size;
    const center = info.universe.boxSize.map(s => (size - s) / 2)
    const scale = (size - 2) / Math.max(...info.universe.boxSize)
    const range = info.universe.range;
    const pivot = range.map(r => (r.max + r.min) / 2)
    const [x, y] = [info.location.worldPos.x, info.location.worldPos.y]

    return {
      transform:
      `translate(${-100 * range[0].min}%, ${-100 * range[1].min}%)
      translate(${100 * center[0]}%, ${100 * center[1]}%)
      translate(${100 * (scale - 1) * (x - pivot[0])}%, ${100 * (scale - 1) * (y - pivot[1])}%)
      scale(${scale})`
    }
  }

  function onCellClick() {
    if (state() === "default") {
      info.map.pickedPosition = info.position;
      return;
    }
    if (info.selection.universe === info.universe){
      info.selection.nebula = info.location?.nebula;
    }
    info.selection.universe = info.universe;
  }

  function className() {
      switch (state()){
        case "default": return ""
        case "valid": return "valid"
        case "clear": return "clear"
        case "selectedAsUniverse": return "valid grown"
        case "selectedAsNebula": return "valid grown special"
        case "picked": return "picked"
      }
    }

  return td({
      onclick: onCellClick },{
      className,
      inlineStyle: calculatePosition
    })([
    span({class: "nebula-title"},{
      innerText: () => {
        switch (state()){
          case "selectedAsUniverse":
          case "selectedAsNebula":
            return info.location?.nebula.name ?? "";
        }
        return "";
      }
    })("")
  ])
}

export function insertAt(data:Data, pos:Coord, name:string) {
  const u = new Universe({name: name})
  const n = new CommonNebula({name: "Unnamed"})

  data.universes.add(u)
  data.addNebula(n, {
    universe: u,
    position: pos
  })
}

export function UniverseMap(info: UniverseMapInfo, selection: {universe?: Universe, nebula?: Nebula}, data: Data) {
  const cells = new Array<NebulaCellInfo[]>()
  const rows = new Array<HTMLTableRowElement>()

  engine.updater.register(update)

  function update(){
    const order = catchOrder();
    switch(order){
      case "resize":
        init();
      case "redata":
        erase();
        fill();
    }
  }
  function catchOrder(){
    if (cells.length !== info.size) return "resize"

    for (let i = 0; i < info.size; i++){
      for (let j = 0; j < info.size; j++){
        const pos = info.viewPoint.add(P(j, i));
        const currentNebula = cells[i][j].location?.nebula;
        const changedNebula = data.universes.map(u => u.get(pos)).find(n => n);
        
        if (currentNebula !== changedNebula) {
          return "redata";
        }
      }
    }
    
    return "none";
  }
  function init(){
    for (let i = 0; i < info.size; i++){
      cells.push([])
      for (let j = 0; j < info.size; j++){
        cells[i].push({
          map: info,
          position: P(j, i),
          selection: selection
        })
      }
    }
    rows.splice(0, rows.length);
    rows.push(...cells.map(r => 
      tr()(r.map(info => NebulaCell(info)))
    ));
  }

  function erase(){
    for (const r of cells){
      for (const cell of r){
        cell.universe = undefined;
        cell.location = undefined;
      }
    }
  }
  function fill(){
    const view = info.viewPoint;
    const size = info.size;

    for (const univ of data.universes.all()){
      for (const neb of univ.nebulaLocations){
        const [x, y] = [neb.worldPos.x, neb.worldPos.y]
        const [dx, dy] = [x - view.x, y - view.y]

        if (dx < 0 || dx >= size) continue;
        if (dy < 0 || dy >= size) continue;

        const cell = cells[dy][dx];

        cell.location = neb;
        cell.universe = univ;
      }
    }
  }

  return div({class: "universe-map-box"})([
    table({class: "universe-map"})(rows),
    Picker(info, data)
  ])
}