import { btn, div, inputText, span, table, td, tr } from "@/funcObject";
import { Universe } from "../../../data/components/Universe";
import { Coord, H, P } from "@/utils/math/coord-system";
import { Data, Nebula } from "../../../data/Data";
import { UIManager } from "@/objects/UIManager";
import "./universeMap.css"

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
    })(
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
    )
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
export class UniverseMap extends UIManager {
  public readonly element;
  public readonly info;
  public readonly layout;
  private readonly selection;
  private readonly data;
  private readonly cells;
  private pickerInput = ""
  constructor(attributes: UniverseMapInfo, selection: {universe?: Universe, nebula?: Nebula}, data: Data){
    super()
    this.info = attributes;
    this.selection = selection;
    this.data = data;
    this.layout = {
      table: table({class: "universe-map"})(),
      picker: div({}, {
        className: () => `cell-picker ${this.info.pickedPosition ? "" : "hidden"}`
      })(
        div({class: "picker-top"})(
          span()("New Universe"),        
          btn({
            class: "close-button",
            onclick: () => this.info.pickedPosition = undefined
          })("X"),
        ),
        inputText({onchange: e=>this.pickerInput = (<HTMLInputElement>e.target).value})(),
        btn({class: "ok-button", onclick: () => {
          if (!this.info.pickedPosition) return;
          const u = new Universe({name: this.pickerInput})
          const n = new Nebula({name: "Unnamed"})

          data.universes.add(u)
          data.addNebula(n, {
            universe: u,
            position: this.info.pickedPosition
          })

          this.info.pickedPosition = undefined;
        }})("확인")
      )
    }
    this.element = div()(
      div({class: "universe-map-box"})(
        this.layout.table,
        this.layout.picker,
      ),
      span()("x: 0, y: 0")
    )
    this.cells = new Array<NebulaCell[]>()
    this.init();
  }
  public init(){
    this.layout.table.innerHTML = "";
    for (let i = 0; i < this.info.size; i++){
      this.cells.push([])
      for (let j = 0; j < this.info.size; j++){
        this.cells[i].push(new NebulaCell(P(j, i), this.info, this.selection))
      }
    }
    for (let i = 0; i < this.cells.length; i++){
      const row = tr()()
      this.layout.table.append(row)
      for (let j = 0; j < this.cells[i].length; j++){
        row.append(this.cells[i][j].element)
      }
    }
    
    super.init()
  }
  public update(){
    const order = this.catchOrder();
    switch(order){
      case "resize":
        this.init();
      case "redata":
        this.erase();
        this.fill();
      case "reselectUniverse":
        this.showUniverse();
    }
    this.pick();
  }
  private catchOrder(){
    if (this.cells.length !== this.info.size) return "resize"

    for (let i = 0; i < this.info.size; i++){
      for (let j = 0; j < this.info.size; j++){
        const pos = this.info.viewPoint.add(P(j, i));
        const currentNebula = this.cells[i][j].nebula;
        const changedNebula = this.data.universes.map(u => u.get(pos)).find(n => n);
        
        if (currentNebula !== changedNebula) {
          return "redata";
        }
      }
    }

    const cellArr = this.cells.flat(1);
    const currentSelection = {
      universe: cellArr.find(c => c.universe === this.selection.universe)?.universe,
      nebula: cellArr.find(c => c.nebula === this.selection.nebula)?.nebula
    }
    if (currentSelection.universe !== this.selection.universe){
      return "reselectUniverse"
    }
    
    return "none";
  }
  private erase(){
    for (const r of this.cells){
      for (const cell of r){
        cell.universe = undefined;
        cell.nebula = undefined;
        cell.element.style.transform = "";
      }
    }
  }
  private fill(){
    const view = this.info.viewPoint;
    const size = this.info.size;

    for (const univ of this.data.universes.all()){
      for (const neb of univ.nebulaInfos){
        const [x, y] = [neb.worldPos.x, neb.worldPos.y]
        const [dx, dy] = [x - view.x, y - view.y]

        if (dx < 0 || dx >= size) continue;
        if (dy < 0 || dy >= size) continue;

        const cell = this.cells[dy][dx];

        cell.nebula = neb.nebula;
        cell.universe = univ;
      }
    }
  }
  private showUniverse(){
    const univ = this.selection.universe;
    if (!univ) return;

    const size = this.info.size;
    const center = univ.boxSize.map(s => (size - s) / 2)
    const scale = (size - 2) / Math.max(...univ.boxSize)
    const pivot = univ.range.map(r => (r.max + r.min) / 2)

    for (const neb of univ.nebulaInfos){
      const [x, y] = [neb.worldPos.x, neb.worldPos.y]
      const view = this.info.viewPoint
      const cell = this.cells[y - view.y]?.[x - view.x]

      if (!cell) continue;

      cell.element.style.transform = `
        translate(${100 * center[0]}%, ${100 * center[1]}%)
        translate(${100 * (scale - 1) * (x - pivot[0])}%, ${100 * (scale - 1) * (y - pivot[1])}%)
        scale(${scale})
      `.trim();
    }
  }
  private pick(){
    if (this.selection.universe || this.selection.nebula) return;

    const pos = this.info.pickedPosition;
    if(!pos) return;

    if (pos.x >= this.info.size / 2) {
      this.layout.picker.style.left = `${100 * (pos.x - 8) / this.info.size}%`;
    }
    else{
      this.layout.picker.style.left = `${100 * (pos.x + 1) / this.info.size}%`;
    }
    if (pos.y >= this.info.size / 2){
      this.layout.picker.style.top = `${100 * (pos.y - 4) / this.info.size}%`;
    }
    else{
      this.layout.picker.style.top = `${100 * (pos.y + 1) / this.info.size}%`;
    }
  }
}