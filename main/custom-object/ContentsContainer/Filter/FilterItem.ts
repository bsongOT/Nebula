import {
  WContainer, SelectMenu, Option,
  MultiSelectMenu, StateBox, WButton
} 
from "@/objects"
import {Filter} from "../"
import {FilterMode} from "./FilterMode"
import {data, Content} from "../../../data/Data"
import { WInputText } from "@/objects/input/";

export class FilterItem extends WContainer {
  private modeObject:FilterMode;
  private typeObject:SelectMenu<string>;
  private condBox:WContainer;
  public get mode(){
    return this.modeObject.value;
  }
  public constructor(filter:Filter){
    super()
    this.class.add("filter-item")
    
    const condUI = {
      "nebula": [
        new MultiSelectMenu(
          data.nebulas.map(n => new Option(n.name, n))
        ).event.onchange(()=>filter.event.change.invoke())
      ],
      "parent": [
        new MultiSelectMenu(
          data.contents.filter(c => c.children.length >= 1).map(c => new Option(c.title, c))
        ).event.onchange(()=>filter.event.change.invoke())
      ],
      "nebula count": [
        new WInputText("number").event.onchange(()=>filter.event.change.invoke()),
        new StateBox(["↑", "↓"]).event.onchange(()=>filter.update())
      ],
      "parent count": [
        new WInputText("number").event.onchange(()=>filter.update()),
        new StateBox(["↑", "↓"]).onchange(()=>filter.update())
      ]
    };
    
    this.family.adoptAll([
      this.modeObject = new FilterMode(filter),
      this.typeObject = new SelectMenu<string>([
        new Option("nebula"),
        new Option("parent"),
        new Option("nebula count"),
        new Option("parent count")
      ]).event.onchange(() => {
        this.condBox.family.empty()
        condUI[this.typeObject.value].forEach(c => this.condBox.adopt(c))
        filter.update()
      }),
      this.condBox = new WContainer(condUI["nebula"]).addClass("condition-box"),
      new WButton("X")
        .class.add("close-button")
        .event.onclick(()=>{
          this.remove()
          filter.update()
        })
    ])
  }
  public test(content:Content){
    switch(this.typeObject.value){
      case "nebula": { 
        const menu = this.condBox.family.children[0];
        const targets = menu.value
        return targets.some(n => n.contentIds.includes(content.id))
      }
      case "parent":{
        const menu = this.condBox.family.children[0];
        const targets = menu.value
        return targets.some(c => c.children.includes(content.id))
      }
      case "nebula count":{
        const ref = Number(this.condBox.family.children[0].value);
        const compare = this.condBox.family.children[1].value
        const count = content.nebulas.length
        
        if (compare === "↑") return count>=ref;
        if (compare === "↓") return count<=ref;
      }
      case "parent count":{
        const ref = Number(this.condBox.family.children[0].value);
        const compare = this.condBox.family.children[1].value
        const count = content.parents.length;
        
        if (compare === "↑") return count >= ref
        if (compare === "↓") return count <= ref
      }
    }
  }
  private testNebula(content:Content){
    
  }
}