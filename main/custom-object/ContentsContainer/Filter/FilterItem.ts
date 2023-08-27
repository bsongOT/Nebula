import {
  WebObject, Container, SelectMenu, Option,
  MultiSelectMenu, InputObject, StateBox, ButtonObject
} 
from "../../"
import {Filter} from "../"
import {FilterMode} from "./FilterMode"
import {data, Content} from "../../../data/Data"

export class FilterItem extends WebObject {
  private modeObject:FilterMode;
  private typeObject:SelectMenu<string>;
  private condBox:Container;
  private closeButton:ButtonObject;
  public get mode(){
    return this.modeObject.value;
  }
  public constructor(filter:Filter){
    super()
    this.addClass("filter-item")
    const condUI = {
      "nebula": [
        new MultiSelectMenu(
          {onchange: ()=>filter.change()},
          data.nebulas.map(n => new Option(n.name, n))
        )
      ],
      "parent": [
        new MultiSelectMenu(
          {onchange: ()=>filter.change()},
          data.contents.filter(c => c.children.length >= 1).map(c => new Option(c.title, c))
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
      this.modeObject = new FilterMode(filter),
      this.typeObject = new SelectMenu([
        new Option("nebula"),
        new Option("parent"),
        new Option("nebula count"),
        new Option("parent count")
      ]),
      this.condBox = new Container({class: "condition-box"}, condUI["nebula"]),
      this.closeButton = new ButtonObject("X", {
          class: "close-button", 
          onclick: ()=>{
            this.remove()
            filter.change()
          }
      })
    ].forEach(e => this.adopt(e))
    
    const cd = this.condBox;
  
    this.typeObject.change = function(){
      cd.empty();
      condUI[this.value].forEach(c => cd.adopt(c))
      filter.change()
    }
  }
  test(content:Content){
    switch(this.typeObject.value){
      case "nebula": { 
        const menu = this.condBox.children[0];
        const targets = menu.value
        return targets.some(n => n.contentIds.includes(content.id))
      }
      case "parent":{
        const menu = this.condBox.children[0];
        const targets = menu.value
        return targets.some(c => c.children.includes(content.id))
      }
      case "nebula count":{
        const ref = Number(this.condBox.children[0].value);
        const compare = this.condBox.children[1].value
        const count = content.nebulas.length
        
        if (compare === "↑") return count>=ref;
        if (compare === "↓") return count<=ref;
      }
      case "parent count":{
        const ref = Number(this.condBox.children[0].value);
        const compare = this.condBox.children[1].value
        const count = content.parents.length;
        
        if (compare === "↑") return count >= ref
        if (compare === "↓") return count <= ref
      }
    }
  }
}