import {
  WebObject, Container, SelectMenu, Option,
  MultiSelectMenu, InputObject, StateBox, ButtonObject
} 
from "../../../objects/index.js"
import {FilterMode} from "./FilterMode.js"
import {contents, nebulas} from "../../../data/Data.js"

export class FilterItem extends WebObject {
  #mode;
  #type;
  #condBox;
  #closeButton
  get mode(){
    return this.#mode.value;
  }
  constructor(filter){
    super()
    this.addClass("filter-item")
    const condUI = {
      "nebula": [
        new MultiSelectMenu(
          {onchange: ()=>filter.change()},
          nebulas.map(n => new Option(n.name, n))
        )
      ],
      "parent": [
        new MultiSelectMenu(
          {onchange: ()=>filter.change()},
          contents.filter(c => c.children.length >= 1).map(c => new Option(c.title, c))
        )
      ],
      "nebula count": [
        new InputObject({type: "number", onchange: ()=>filter.change()}),
        new StateBox({onchange: ()=>filter.change()}, ["↑", "↓"])
      ],
      "parent count": [
        new InputObject({type: "number", onchange: ()=>filter.change()}),
        new StateBox({onchange: ()=>filter.change()}, ["↑", "↓"])
      ]
    };
    
    [
      this.#mode = new FilterMode(filter),
      this.#type = new SelectMenu([
        new Option("nebula"),
        new Option("parent"),
        new Option("nebula count"),
        new Option("parent count")
      ]),
      this.#condBox = new Container("condition-box", condUI["nebula"]),
      this.#closeButton = new ButtonObject("X", {
          class: "close-button", 
          onclick: ()=>{
            this.remove()
            filter.change()
          }
      })
    ].forEach(e => this.adopt(e))
    
    const cd = this.#condBox;
  
    this.#type.change = function(){
      cd.empty();
      condUI[this.value].forEach(c => cd.adopt(c))
      filter.change()
    }
  }
  test(content){
    switch(this.#type.value){
      case "nebula": { 
        const menu = this.#condBox.children[0];
        const targets = menu.value
        return targets.some(n => n.contentIds.includes(content.id))
      }
      case "parent":{
        const menu = this.#condBox.children[0];
        const targets = menu.value
        return targets.some(c => c.children.includes(content.id))
      }
      case "nebula count":{
        const ref = Number(this.#condBox.children[0].value);
        const compare = this.#condBox.children[1].value
        const count = content.nebulas.length
        
        if (compare === "↑") return count>=ref;
        if (compare === "↓") return count<=ref;
      }
      case "parent count":{
        const ref = Number(this.#condBox.children[0].value);
        const compare = this.#condBox.children[1].value
        const count = content.parents.length;
        
        if (compare === "↑") return count >= ref
        if (compare === "↓") return count <= ref
      }
    }
  }
}