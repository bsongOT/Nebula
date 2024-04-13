import { span, ul } from "@/funcObject";
import { selli } from "@/objects/list/selli";
import { Universe } from "../../data/components/Universe";
import { DataCollection } from "../../data/DataCollection";
import { DTE } from "@/objects/DTE";

export class UniverseList extends DTE{
  public readonly element:HTMLUListElement;
  public readonly info
  public readonly layout;
  constructor(attributes:{universes:DataCollection<Universe>}){
    super();
    this.element = ul({class: "universe-list"})()
    this.info = attributes;
    this.layout = {};
    this.init()
  }
  public init(){
    super.init()
  }
  public update(){
    this.element.innerHTML = "";

    const dataToElement = (univ:Universe) => selli(span()(univ.id.toString()))
    this.element.append(...this.info.universes.map(dataToElement))
  }
  public detect(){
    const shownData = this.getShownData()
    const datas = this.info.universes.map(u => u.id.toString())

    if (shownData.length !== datas.length) return true;
    return shownData.some((d, i) => d !== datas[i])
  }
  private getShownData(){
    const children = [...this.element.children] as HTMLElement[];
    const texts = children.map(c => c.innerText)

    return texts;
  }
}