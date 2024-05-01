import { engine } from "@/engine";
import { span, table, td, tr } from "@/funcObject";
import { DataCollection } from "../../data/DataCollection";
import { Universe } from "../../data/components/Universe";
import { Coord } from "@/utils/math/coord-system";
import { Nebula } from "../../data/Data";
import { UIManager } from "@/objects/UIManager";

type UniverseMapInfo = {
  size: number,
  viewPoint: Coord
}
type NebulaCellState = 
  "default" | "valid" | "clear" | 
  "selectedAsUniverse" | "selectedAsNebula"

class NebulaCell {
  public readonly element:HTMLTableCellElement;
  public readonly title:HTMLElement;
  public nebula:Nebula|undefined;
  public universe:Universe|undefined;

  private $state:NebulaCellState = "clear";
  public get state(){
    return this.$state;
  }
  public set state(v){
    this.$state = v;
    
    switch (v){
      case "default": {
        this.element.className = ""
        return;
      }
      case "valid": {
        this.element.className = "valid"
        this.element.style.background = "skyblue"
        return;
      }
      case "clear": {
        this.element.className = "clear"
        return;
      }
      case "selectedAsUniverse": {
        this.element.className = "valid grown"
        this.title.innerText = this.nebula?.name ?? "";
        return;
      }
      case "selectedAsNebula": {
        this.element.className = "valid grown special"
        return;
      }
    }
  }

  constructor(){
    this.title = span({class: "nebula-title"})("")
    this.element = td()(this.title)
  }
}
export class UniverseMap extends UIManager {
  public readonly element;
  public readonly info;
  public readonly layout;
  private readonly selection;
  private readonly data;
  private readonly cells;
  constructor(attributes: UniverseMapInfo, selection: {universe?: Universe, nebula?: Nebula}, data: {universes:DataCollection<Universe>}){
    super()
    this.element = table({class: "universe-map"})()
    this.info = attributes;
    this.selection = selection;
    this.data = data;
    this.layout = {
    }
    this.cells = new Array<NebulaCell[]>()
    this.init();
  }
  public init(){
    this.element.innerHTML = "";
    for (let i = 0; i < this.info.size; i++){
      this.cells.push([])
      for (let j = 0; j < this.info.size; j++){
        this.cells[i].push(new NebulaCell())
      }
    }
    for (let i = 0; i < this.cells.length; i++){
      const row = tr()()
      this.element.append(row)
      for (let j = 0; j < this.cells[i].length; j++){
        row.append(this.cells[i][j].element)
      }
    }
    
    super.init()
  }
  public update(){
    const require = this.detectState();
    if (require === "data"){
      this.erase();
      this.fill();
      this.showUniverse()
      return;
    }
    if (require === "selection"){
      this.showUniverse();
      return;
    }
  }
  public detect(){
    return true;
  }
  public detectState(){
    const realNebulaInfos = this.data.universes.map(u => u.nebulaInfos).flat(1)
    for (let i = 0; i < this.info.size; i++){
      for (let j = 0; j < this.info.size; j++){
        const shownNebula = this.cells[i][j].nebula;
        const realNebula = realNebulaInfos.find(ni => ni.worldPos.eq(new Coord(j, i)))?.nebula

        if (shownNebula !== realNebula) return "data";
      }
    }

    if (this.cells.flat(1).find(c => c.state === "selectedAsUniverse")?.universe !== this.selection.universe){
      return "selection"
    }
    
    return "none";
  }
  private erase(){
    for (const r of this.cells){
      for (const cell of r){
        cell.state = "default";
        cell.element.style.transform = "";
        cell.title.innerText = "";
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

        this.cells[dy][dx].nebula = neb.nebula;
        this.cells[dy][dx].universe = univ;
        const cell = this.cells[dy][dx];
        
        cell.state = "valid"
        cell.element.onclick = () => {
          if (this.selection.universe === univ){
            this.selection.nebula = neb.nebula;
            this.appearNebula()
            return;
          }
          this.selection.universe = univ;
          this.showUniverse()
        }
      }
    }
  }
  private appearNebula(){
    const univ = this.selection.universe;

    if (!univ) return;

    for (const row of this.cells){
      for (const cell of row){
        if (cell.state === "selectedAsNebula"){
          cell.state = "selectedAsUniverse";
        }
      }
    }

    const nebulaCell = this.cells.flat(1).find(c => c.nebula === this.selection.nebula)
    if (!nebulaCell) return;

    nebulaCell.state = "selectedAsNebula";
  }
  private showUniverse(){
    const univ = this.selection.universe;

    if (!univ) return;

    for (const row of this.cells){
      for (const cell of row){
        cell.state = "clear";
      }
    }

    const size = this.info.size;
    const center = univ.boxSize.map(s => (size - s) / 2)
    const scale = (size - 2) / Math.max(...univ.boxSize)
    const pivot = univ.range.map(r => (r.max + r.min) / 2)

    for (const neb of univ.nebulaInfos){
      const [x, y] = [neb.worldPos.x, neb.worldPos.y]
      const view = this.info.viewPoint
      const cell = this.cells[y - view.y]?.[x - view.x]

      if (!cell) continue;

      cell.state = "selectedAsUniverse"
      cell.element.style.transform = `
        translate(${100 * center[0]}%, ${100 * center[1]}%)
        translate(${100 * (scale - 1) * (x - pivot[0])}%, ${100 * (scale - 1) * (y - pivot[1])}%)
        scale(${scale})
      `.trim();
    }
  }
}