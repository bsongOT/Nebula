import { engine } from "@/engine";
import { span, table, td, tr } from "@/funcObject";
import { DataCollection } from "../../data/DataCollection";
import { Universe } from "../../data/components/Universe";
import { Coord } from "@/utils/math/coord-system";
import { Nebula } from "../../data/Data";

type UniverseMapInfo = {
  size: number,
  universes: DataCollection<Universe>,
  viewPoint: Coord,
  selection?: Universe,
  selectedNebula?: Nebula
}
class NebulaCell {
  public readonly element:HTMLTableCellElement;
  private readonly title:HTMLElement;
  public nebula:Nebula|undefined;
  public selectedAsUniverse:boolean = false;

  constructor(){
    this.title = span({class: "nebula-title"})("")
    this.element = td()(this.title)
  }

  public clear(){
    this.element.classList.add("clear")
    this.element.style.zIndex = "auto"
    this.title.innerText = ""
    this.selectedAsUniverse = false;
  }

  public appear(){
    if (!this.nebula) return;
    this.selectedAsUniverse = true;
    this.element.classList.remove("clear")
    this.element.style.zIndex = '1';
    this.title.innerText = this.nebula.name;
  }
}
export class UniverseMap {
  public readonly element;
  public readonly info;
  private readonly cells;
  constructor(attributes: UniverseMapInfo){
    this.element = table({class: "universe-map"})()
    this.info = attributes;
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
    
    engine.updater.register(() => this.update())
  }
  public update(){
    if (!this.detect()) return;
    this.erase()
    this.fill()
    if (this.info.selection)
      this.showUniverse()
  }
  public detect(){
    // universes change
    const realNebulaInfos = this.info.universes.map(u => u.nebulaInfos).flat(1)
    for (let i = 0; i < this.info.size; i++){
      for (let j = 0; j < this.info.size; j++){
        const shownNebula = this.cells[i][j].nebula;
        const realNebula = realNebulaInfos.find(ni => ni.worldPos.eq(new Coord(j, i)))?.nebula

        if (shownNebula !== realNebula) return true;
      }
    }

    // universe selection change
    const realSelection = this.info.selection;
    let shownPos = [-1, -1] as [number, number];
    
    for (let i = 0; i < this.info.size; i++){
      for (let j = 0; j < this.info.size; j++){
        if (!this.cells[j][i].selectedAsUniverse) continue;
        shownPos = [j, i];
      }
    }

    if (!realSelection){
      if (shownPos[0] !== -1 && shownPos[1] !== -1) return true;
    }
    else {
      if (!realSelection.isIn(...shownPos)) return true;
    }
    
    return false;
  }
  private erase(){
    for (const r of this.cells){
      for (const cell of r){
        cell.element.className = "";
        cell.element.style.transform = "";
      }
    }
  }
  private fill(){
    const view = this.info.viewPoint;
    const size = this.info.size;

    for (const univ of this.info.universes.all()){
      for (const neb of univ.nebulaInfos){
        const [x, y] = [neb.worldPos.x, neb.worldPos.y]
        const [dx, dy] = [x - view.x, y - view.y]

        if (dx < 0 || dx >= size) continue;
        if (dy < 0 || dy >= size) continue;

        this.cells[dy][dx].nebula = neb.nebula;
        const cell = this.cells[dy][dx].element;
        
        cell.onclick = () => {
          if (this.info.selection === univ){
            for (const row of this.cells){
              for (const cell of row){
                cell.element.classList.remove("selected-cell")
              }
            }
            cell.classList.add("selected-cell")
            this.info.selectedNebula = neb.nebula;
          }
          this.info.selection = univ;
        }
        cell.classList.add("valid")

        //styling
        cell.style.background = 'skyblue'
      }
    }
  }
  private showUniverse(){
    const univ = this.info.selection!;
    
    for (const row of this.cells){
      for (const cell of row){
        cell.clear()
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

      cell.appear();
      cell.element.style.transform = `
        translate(${100 * center[0]}%, ${100 * center[1]}%)
        translate(${100 * (scale - 1) * (x - pivot[0])}%, ${100 * (scale - 1) * (y - pivot[1])}%)
        scale(${scale})
      `.trim();
    }
  }
}