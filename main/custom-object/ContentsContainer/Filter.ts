import {Container} from "../"
import {FilterItem} from "./Filter/FilterItem"
import {AddFilterButton} from "./Filter/AddFilterButton"
import {Content} from "../../data/Data"
import { ChangableObjectOption } from "../../../engine/types";

export class Filter extends Container{
  private box:Container;
  protected option:ChangableObjectOption;

  constructor(option:ChangableObjectOption){
    super({class: "filter-box", ...option});
    
    [
      this.box = new Container(),
      new AddFilterButton(this)
    ].forEach(e => this.adopt(e))
  }
  change(){
    this.option.onchange?.()
  }
  test(content:Content){
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
  add(){
    this.box.adopt(new FilterItem(this))
    this.change()
  }
}