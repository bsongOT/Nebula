import {WContainer, WMultiSelectMenu, WOption, WSelectMenu, WStateBox}
from "@/objects"
import { Content, Data, Nebula } from "../../data/Data"
import { WInputText } from "@/objects/input/";
import { btn, div, multiselect, option, select, statebox } from "@/funcObject";
import { DOMObject } from "@/objects/DOMObject";
import { WSelectableItem } from "@/objects/list";
import { DataCollection } from "../../data/DataCollection";

type IfBlock = DOMObject<any> & {test:(content:Content)=>boolean}
class IfNebulaBlock extends WMultiSelectMenu<Nebula> {
  public readonly test: (content:Content) => boolean;
  constructor(nebulas:DataCollection<Nebula>){
    super()
    this.family.adoptAll(
      nebulas.map(n => option(n.name, n))
    )
    this.test = (content:Content) => {
      return this.selectedDatas.some(
        n => n?.tree.nodes
                  .map(node => node.data?.id)
                  .includes(content.id))
    }
  }
}
class IfParentBlock extends WMultiSelectMenu<Content> {
  constructor(contents:DataCollection<Content>){
    super()
    this.family.adoptAll(
      contents
        .filter(c => c.children.length >= 3)
        .map(c => option(c.title, c))
    )
  }
  public readonly test =(content:Content) => {
    return this.selectedDatas.some(
      c => c?.children.includes(content)
    )
  }
}
class IfNebulaCountBlock extends WContainer {
  public readonly test: (content: Content) => boolean;
  constructor(listUpdate:()=>void){
    super();
    
    const threshold = new WInputText("number").onchange(listUpdate);
    const largerOrSmaller = statebox("↑", "↓").onchange(listUpdate);

    this.family.adoptAll([
      threshold,
      largerOrSmaller
    ])
    
    this.test = function(content:Content){
      switch(largerOrSmaller.index){
        case 0: return content.nebulas.length >= Number(threshold.value);
        case 1: return content.nebulas.length <= Number(threshold.value);
        default: return false;
      }
    }
  }
}
class IfParentCountBlock extends WContainer {
  public readonly test:(content: Content) => boolean;
  constructor(listUpdate:()=>void){
    super();

    const threshold = new WInputText("number").onchange(listUpdate);
    const largerOrSmaller = statebox("↑", "↓").onchange(listUpdate)

    this.family.adoptAll([
      threshold,
      largerOrSmaller
    ])

    this.test = function(content:Content){
      switch(largerOrSmaller.index){
        case 0: return content.children.length >= Number(threshold.value);
        case 1: return content.children.length <= Number(threshold.value);
        default: return false;
      }
    }
  }
}

export class FilterItem extends WSelectableItem<()=>boolean>{
  private kindMenu:WSelectMenu<IfBlock>;

  constructor(listUpdate:()=>void, data:Data){
    super()
    this.class.add("filter-item")

    const ifNebulaBlock = new IfNebulaBlock(data.nebulas).onchange(listUpdate)
    const ifParentBlock = new IfParentBlock(data.contents).onchange(listUpdate)
    const ifNebulaCountBlock = new IfNebulaCountBlock(listUpdate)
    const ifParentCountBlock = new IfParentCountBlock(listUpdate)

    const conditionBox = div({class: "condition-box"})(ifNebulaBlock)

    this.family.adoptAll([
      statebox("Omit", "Spoil")
        .class.add("filter-mode")
        .onchange(listUpdate),
      this.kindMenu = 
      select<IfBlock>(
        option("nebula", ifNebulaBlock),
        option("parent", ifParentBlock),
        option("nebula count", ifNebulaCountBlock),
        option("parent count", ifParentCountBlock)
      )
        .onchange(() => {
          conditionBox.family.empty();
          conditionBox.family.adopt(this.kindMenu.selectedData!)
          listUpdate()
        }),
      conditionBox,
      btn("X")
        .class.add("close-button")
        .input.onclick(()=>{
          this.family.remove()
          listUpdate()
        })
    ])
  }
  public test(content:Content){
    if (this.kindMenu.selectedData!.test(content)) return "pass"
    if (this.mode.value === "Omit") return "omit"
    return "spoil"
  }
}