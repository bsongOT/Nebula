import {ButtonObject, Container, Detail} from "@/objects"
import {FilterItem, AddFilterButton} from "./"
import {Content} from "../../../data/Data"
import "../../../styles/Filter.css"

export class Filter extends Detail{
  private box:Container;
  private $onchange:()=>void;

  constructor(){
    let box:Container;
    let btn:AddFilterButton;
    super([
      new ButtonObject("Filter"),
      new Container([
        btn = new AddFilterButton().addClass("add-filter-button"),
        box = new Container().addClass("filter-box")
      ])
    ]);
    this.addClass("filter");
    this.box = box;
    btn.ready(this)
  }
  public update(){
    this.$onchange();
    return this;
  }
  public onchange(onchange:()=>void){
    this.$onchange = onchange;
    return this;
  }
  public test(content:Content):boolean|string{
    const filters = this.box.children as FilterItem[];
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
    this.box.adopt(new FilterItem(this))
    this.update()
  }
}