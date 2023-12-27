import {WContainer, WButton} from "@/objects"
import {StarList} from "./StarListContainer/StarList"
import {Nebula} from "../data/Data"
import "../styles/StarList.css"

export const StarListContainer = (nebula:Nebula) => {
  let starList:StarList;
  
  const updent = ()=>starList.selection.updent()
  const outdent = ()=>starList.selection.outdent()
  const downdent = ()=>starList.selection.downdent()
  const indent = ()=>starList.selection.indent()

  return (
  new WContainer([
    starList = new StarList(nebula),
    new WContainer([
      new WButton("↑")
        .class.add("up-arrow")
        .event.onclick(updent),
      new WButton("←")
        .class.add("left-arrow")
        .event.onclick(outdent),
      new WButton("↓")
        .class.add("down-arrow")
        .event.onclick(downdent),
      new WButton("→")
        .class.add("right-arrow")
        .event.onclick(indent)
    ]).class.add("arrow-button-container")
  ]))
}