import {ButtonObject, Container, Detail} from "../"
import {FilterItem} from "./Filter/FilterItem"
import {AddFilterButton} from "./Filter/AddFilterButton"
import {Content} from "../../data/Data"

export class Filter extends Container{
  private box:Container;
  private $onchange:()=>void;

  constructor(){
    super();
    this.addClass("filter-box");
    [
      new Detail([
        new ButtonObject("Filter"),
        new Container([
          this.box = new Container(),
          new AddFilterButton(this)
        ])
      ])
    ].forEach(e => this.adopt(e))
  }
  public update(){
    this.$onchange();
    return this;
  }
  public onchange(onchange:()=>void){
    this.$onchange = onchange;
    return this;
  }
  public test(content:Content){
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