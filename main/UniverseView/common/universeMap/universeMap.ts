import { btn, div, inputText, span, table, td, tr } from "@/funcObject";
import { Universe } from "../../../data/components/Universe";
import { Coord, H, P } from "@/utils/math/coord-system";
import { Data, Nebula } from "../../../data/Data";
import "./universeMap.css"
import { engine } from "@/engine";

export type UniverseMapInfo = {
  size: number,
  viewPoint: Coord,
  pickedPosition?: Coord
}
type NebulaCellState = 
  "default" | "valid" | "clear" | 
  "selectedAsUniverse" | "selectedAsNebula" |
  "picked"

export class NebulaCell {
  public readonly element:HTMLTableCellElement;
  public readonly position:Coord;
  public nebula:Nebula|undefined;
  public universe:Universe|undefined;
  
  private readonly info;
  private readonly selection;

  public get state():NebulaCellState{
    if (this.universe && this.nebula) {
      if (!this.selection.universe) return "valid";
      if (this.selection.universe !== this.universe) return "clear"
      if (this.selection.nebula !== this.nebula) return "selectedAsUniverse"
            
      return "selectedAsNebula"
    }

    if (this.selection.universe) return "clear"
    if (this.info.pickedPosition &&
       this.position.eq(this.info.pickedPosition)) return "picked"

    return "default"
  }

  constructor(position:Coord, info:{pickedPosition?: Coord}, selection:{universe?:Universe, nebula?:Nebula}){
    this.position = position;
    this.info = info;
    this.selection = selection;
    this.element = td({
      onclick: () => this.onclick(info, selection)
    },{
      className: this.className
    })([
      span({class: "nebula-title"},{
        innerText: () => {
          switch (this.state){
            case "selectedAsUniverse":
            case "selectedAsNebula":
              return this.nebula?.name ?? "";
          }
          return "";
        }
      })("")
    ])
  }

  private readonly onclick = (info:{pickedPosition?:Coord}, selection:{universe?:Universe, nebula?:Nebula}) => {
    if (this.state === "default") {
      info.pickedPosition = this.position;
      return;
    }
    if (selection.universe === this.universe){
      selection.nebula = this.nebula;
    }
    selection.universe = this.universe;
  }

  private readonly className = () => {
    switch (this.state){
      case "default": return ""
      case "valid": return "valid"
      case "clear": return "clear"
      case "selectedAsUniverse": return "valid grown"
      case "selectedAsNebula": return "valid grown special"
      case "picked": return "picked"
    }
  }
}

export function insertAt(data:Data, pos:Coord, name:string) {
  const u = new Universe({name: name})
  const n = new Nebula({name: "Unnamed"})

  data.universes.add(u)
  data.addNebula(n, {
    universe: u,
    position: pos
  })
}

export function Picker(info:{pickedPosition?:Coord, size:number}, data:Data){
  let input = "";
  function getPosition(){
    const style = {
      left: "0",
      top: "0"
    }

    const pos = info.pickedPosition;
    if (!pos) return style;
    
    if (pos.x >= info.size / 2) {
      style.left = `${100 * (pos.x - 8) / info.size}%`;
    }
    else{
      style.left = `${100 * (pos.x + 1) / info.size}%`;
    }
    if (pos.y >= info.size / 2){
      style.top = `${100 * (pos.y - 4) / info.size}%`;
    }
    else{
      style.top = `${100 * (pos.y + 1) / info.size}%`;
    }

    return style;
  }
  const onClickClose = () => info.pickedPosition = undefined
  const onClickOK = () => {
    if (info.pickedPosition)
      insertAt(data, info.pickedPosition, input)
    info.pickedPosition = undefined;
  }

  return div({}, {inlineStyle: getPosition, className: () => `cell-picker ${info.pickedPosition ? "" : "hidden"}`})([
    div({class: "picker-top"})([
      span()("New Universe"),        
      btn({ class: "close-button", onclick: onClickClose })("X"),
    ]),
    inputText({onchange: e => input = (<HTMLInputElement>e.target).value})(),
    btn({class: "ok-button", onclick: onClickOK})("확인")
  ])
}
export function UniverseMap(info: UniverseMapInfo, selection: {universe?: Universe, nebula?: Nebula}, data: Data) {
  const cells = new Array<NebulaCell[]>()
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
      case "reselectUniverse":
        showUniverse();
    }
  }
  function catchOrder(){
    if (cells.length !== info.size) return "resize"

    for (let i = 0; i < info.size; i++){
      for (let j = 0; j < info.size; j++){
        const pos = info.viewPoint.add(P(j, i));
        const currentNebula = cells[i][j].nebula;
        const changedNebula = data.universes.map(u => u.get(pos)).find(n => n);
        
        if (currentNebula !== changedNebula) {
          return "redata";
        }
      }
    }

    const cellArr = cells.flat(1);
    const currentSelection = {
      universe: cellArr.find(c => c.universe === selection.universe)?.universe,
      nebula: cellArr.find(c => c.nebula === selection.nebula)?.nebula
    }
    if (currentSelection.universe !== selection.universe){
      return "reselectUniverse"
    }
    
    return "none";
  }
  function init(){
    for (let i = 0; i < info.size; i++){
      cells.push([])
      for (let j = 0; j < info.size; j++){
        cells[i].push(new NebulaCell(P(j, i), info, selection))
      }
    }
    rows.splice(0, rows.length);
    rows.push(...cells.map(r => 
      tr()(r.map(cell => cell.element))
    ));
  }

  function erase(){
    for (const r of cells){
      for (const cell of r){
        cell.universe = undefined;
        cell.nebula = undefined;
        cell.element.style.transform = "";
      }
    }
  }
  function fill(){
    const view = info.viewPoint;
    const size = info.size;

    for (const univ of data.universes.all()){
      for (const neb of univ.nebulaInfos){
        const [x, y] = [neb.worldPos.x, neb.worldPos.y]
        const [dx, dy] = [x - view.x, y - view.y]

        if (dx < 0 || dx >= size) continue;
        if (dy < 0 || dy >= size) continue;

        const cell = cells[dy][dx];

        cell.nebula = neb.nebula;
        cell.universe = univ;
      }
    }
  }
  function showUniverse(){
    const univ = selection.universe;
    if (!univ) return;

    const size = info.size;
    const center = univ.boxSize.map(s => (size - s) / 2)
    const scale = (size - 2) / Math.max(...univ.boxSize)
    const pivot = univ.range.map(r => (r.max + r.min) / 2)

    for (const neb of univ.nebulaInfos){
      const [x, y] = [neb.worldPos.x, neb.worldPos.y]
      const view = info.viewPoint
      const cell = cells[y - view.y]?.[x - view.x]

      if (!cell) continue;

      cell.element.style.transform = `
        translate(${100 * center[0]}%, ${100 * center[1]}%)
        translate(${100 * (scale - 1) * (x - pivot[0])}%, ${100 * (scale - 1) * (y - pivot[1])}%)
        scale(${scale})
      `.trim();
    }
  }

  return div({class: "universe-map-box"})([
    table({class: "universe-map"})(rows),
    Picker(info, data),
  ])
}