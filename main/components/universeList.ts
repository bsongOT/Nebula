import { li, span, ul } from "@/funcObject";
import { selli } from "@/objects/UI/list/selli";
import { Universe } from "../data/components/Universe";
import { DataCollection } from "../data/DataCollection";
import { UIManager } from "@/objects/UIManager";

export class UniverseList extends UIManager{
  public readonly element:HTMLUListElement;
  public readonly info
  public readonly layout;
  private selection;

  private pairs;
  private prevSelection;
  constructor(attributes:{universes:DataCollection<Universe>}, selection:{universe?:Universe}){
    super();
    this.element = ul({class: "universe-list"})()
    this.info = attributes;
    this.layout = {};
    this.pairs = new Array<{element:HTMLLIElement, universe:Universe}>()
    this.selection = selection;
    this.prevSelection = selection.universe;
    this.init()
  }
  public update(){
    const result = this.detectState();
    
    if (result === "data"){
      this.element.innerHTML = "";

      this.pairs = this.info.universes.map(u => ({
        element: selli({onclick: () => this.selection.universe = u})(span()(u.name)),
        universe: u
      }))

      this.element.append(...this.pairs.map(p => p.element))
      this.prevSelection = this.selection.universe;
    }
    if (result === "selection"){
      this.pairs.find(p => p.universe === this.selection.universe)?.element.click()
    }
  }
  public detectState(){
    const uvs = this.info.universes.all();
    if (uvs.length !== this.pairs.length){
      return "data"
    }
    if (uvs.some((v, i) => v !== this.pairs[i].universe)){
      return "data"
    }
    if (this.selection.universe !== this.prevSelection){
      return "selection"
    }
    return "none"
  }
}