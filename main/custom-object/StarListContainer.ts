import {WContainer, WButton} from "@/objects"
import {StarList} from "./StarListContainer/StarList"
import {Nebula} from "../data/Data"
import "../styles/StarList.css"
import { btn, div } from "@/funcObject"

export const StarListContainer = (nebula:Nebula) => {
  let starList:StarList;
  
  const updent = ()=>starList.selection.updent()
  const outdent = ()=>starList.selection.outdent()
  const downdent = ()=>starList.selection.downdent()
  const indent = ()=>starList.selection.indent()

  return (
  div(
    starList = new StarList(nebula),
    div(
      btn("↑")
        .class.add("up-arrow")
        .event.onclick(updent),
      btn("←")
        .class.add("left-arrow")
        .event.onclick(outdent),
      btn("↓")
        .class.add("down-arrow")
        .event.onclick(downdent),
      btn("→")
        .class.add("right-arrow")
        .event.onclick(indent)
    ).class.add("arrow-button-container")
  ))
}