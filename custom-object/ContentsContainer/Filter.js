import {WebObject, Container} from "../../objects/index.js"
import {FilterMode} from "./Filter/FilterMode.js"
import {FilterItem} from "./Filter/FilterItem.js"
import {AddFilterButton} from "./Filter/AddFilterButton.js"

export class Filter extends WebObject{
  #box;
  #change;

  constructor(option){
    super("div", {class: "filter-box"});
    
    [
      this.#box = new Container(),
      new AddFilterButton(this)
    ].forEach(e => this.adopt(e))
    
    this.#change = option?.onchange;
  }
  change(){
    this.#change?.()
  }
  test(content){
    const filters = this.#box.children;
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
    this.#box.adopt(new FilterItem(this))
  }
}