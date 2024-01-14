import {WContainer, WText} from "@/objects"
import {FilterMode} from "./Filter/FilterMode"
import {hangulSeperate} from "@/utils/utils"
import {Content} from "../../data/Data"
import "../../styles/Search.css"
import { div, span } from "@/funcObject"

const search = 
  div(
    span("돋보기").class.add("search-icon"),
    inputText().oninput(listUpdate),
    filterMode()
  ).class.add("search");

function testSearch(searchUI:WContainer, content:Content){
  const sepTitle = hangulSeperate(content.title)
  const sepSearch = hangulSeperate(searchUI.inputText.value)
    
  return sepTitle.includes(sepSearch)
}