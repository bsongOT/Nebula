import {WButton, WContainer, WDetail} from "@/objects"
import {FilterItem} from "./"
import {Content} from "../../../data/Data"
import "../../../styles/Filter.css"

export class Filter extends WDetail{
  private box:WContainer;

  constructor(){
    let box:WContainer;
    super([
      new WButton("Filter"),
      new WContainer([
        new WButton("add filter")
            .class.add("add-filter-button")
            .event.onclick(()=>this.add()),
  box=  new WContainer().class.add("filter-box")
      ])
    ]);
    this.class.add("filter");
    this.box = box;
  }
  public test(content:Content):boolean|string{
    const filters = this.box.family.children as FilterItem[];
    let spoiled = false;
    
    for (let f of filters){
      const m = f.mode;

      if (f.test(content)) continue;
      if (m === "omit") return "omit"
      if (m === "spoil") spoiled = true;
    }
    
    return spoiled ? "spoil" : true;
  }
  public add(){
    this.box.family.adopt(new FilterItem(this))
    this.event.change.invoke()
  }
}