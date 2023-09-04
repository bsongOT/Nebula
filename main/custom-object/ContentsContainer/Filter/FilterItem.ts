import {
  Container, SelectMenu, Option,
  MultiSelectMenu, InputObject, StateBox, ButtonObject
} 
from "../../"
import {Filter} from "../"
import {FilterMode} from "./FilterMode"
import {data, Content} from "../../../data/Data"

export class FilterItem extends Container {
  private modeObject:FilterMode;
  private typeObject:SelectMenu<string>;
  private condBox:Container;
  public get mode(){
    return this.modeObject.value;
  }
  public constructor(filter:Filter){
    super()
    this.addClass("filter-item")
    const condUI = {
      "nebula": [
        new MultiSelectMenu(
          data.getNebulas().map(n => new Option(n.name, n))
        ).onchange(()=>filter.update())
      ],
      "parent": [
        new MultiSelectMenu(
          data.getContents().filter(c => c.children.length >= 1).map(c => new Option(c.title, c))
        ).onchange(()=>filter.update())
      ],
      "nebula count": [
        new InputObject().setType("number").onchange(()=>filter.update()),
        new StateBox(["↑", "↓"]).onchange(()=>filter.update())
      ],
      "parent count": [
        new InputObject().setType("number").onchange(()=>filter.update()),
        new StateBox(["↑", "↓"]).onchange(()=>filter.update())
      ]
    };
    
    [
      this.modeObject = new FilterMode(filter),
      this.typeObject = new SelectMenu<string>([
        new Option("nebula"),
        new Option("parent"),
        new Option("nebula count"),
        new Option("parent count")
      ]).onchange(() => {
        this.condBox.empty()
        condUI[this.typeObject.value].forEach(c => this.condBox.adopt(c))
        filter.update()
      }),
      this.condBox = new Container(condUI["nebula"]).addClass("conditional-box"),
      new ButtonObject("X")
        .addClass("close-button")
        .onclick(()=>{
          this.remove()
          filter.update()
        })
    ].forEach(e => this.adopt(e))
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