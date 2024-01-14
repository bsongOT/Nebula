import {WContainer, WOption, WSelectMenu, WStateBox}
from "@/objects"
import {data, Content} from "../../../data/Data"
import { WInputText } from "@/objects/input/";
import { btn, div, multiselect, select, statebox } from "@/funcObject";
import { DOMObject } from "@/objects/DOMObject";

let s:WSelectMenu<DOMObject<any>>;
let cb:WContainer;
let ncuStruct:{
  counter:WInputText,
  compare:WStateBox
}

export const filterItem = (listUpdate:()=>void) => {
  const nebulaOptions = data.nebulas.map(n => new WOption(n.name, n))
  const nebulaUI = multiselect(...nebulaOptions).onchange(listUpdate)

  const parentUI = multiselect(
    ...data.contents
      .filter(c => c.children.length >= 3)
      .map(c => new WOption(c.title, c))
  ).onchange(listUpdate)

  const nebulaCountUI = div(...Object.values(
  ncuStruct = {
    counter: new WInputText("number").onchange(listUpdate),
    compare: statebox("↑", "↓").onchange(listUpdate)
  }))

  const parentsCountUI = div(
    new WInputText("number").onchange(listUpdate),
    statebox("↑", "↓").onchange(listUpdate)
  )

  const item = 
  div(
    statebox("omit", "spoil")
      .class.add("filter-mode")
      .onchange(listUpdate),
s=  select<DOMObject<any>>(
      new WOption("nebula", nebulaUI),
      new WOption("parent", parentUI),
      new WOption("nebula count", nebulaCountUI),
      new WOption("parent count", parentsCountUI)
    )
      .onchange(()=> {
        cb.family.empty()
        cb.family.adopt(s.value)
        filter.update()
      }),
cb= div(s.selectedData!).class.add("condition-box"),
    btn("X")
      .class.add("close-button")
      .input.onclick(()=>{
        item.family.remove();
        listUpdate()
      })
  ).class.add("filter-item");

  const test = (content:Content) => {
    switch(s.selectedData){
      case nebulaUI: 
        return nebulaUI.selectedDatas.some(n => n.contentIds.includes(content.id))
      case parentUI: 
        return parentUI.selectedDatas.some(c => c.children.includes(content.id))
      case nebulaCountUI:
        return ncuStruct.counter.value >= content.parents.length
      case parentsCountUI:
        return parentsCountUI.inputText.value
    }
  }

  return item;
}

function test(content:Content){
  switch(){
    case "nebula count":{
      const compare = condBox.family.children[1].value
      const count = content.nebulas.length
        
      if (compare === "↑") return count>=ref;
      if (compare === "↓") return count<=ref;
    }
    case "parent count":{
      const compare = condBox.family.children[1].value
      const count = content.parents.length;
        
      if (compare === "↑") return count >= ref
      if (compare === "↓") return count <= ref
    }
  }
}