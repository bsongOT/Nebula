
import { WContainer, WDetail } from "@/objects/"
import { Content, data } from "../../data/Data";
import { DataCollection } from "../../data/DataCollection";
import "../../styles/ContentsContainer.css"
import "../../styles/Tool-box.css"
import { btn, div, sul } from "@/funcObject";
import { FilterItem } from "./FilterItem";
import { contentItem } from "./List/ContentItem";

export function contentsList(){
  const list = sul().class.add("contrnts-list");


  function listUpdate(){
    list.family.empty();
    for (let c of data.contents.all()){
      const result = test(c);

      if (result === "omit") continue;
      if (result === "spoil"){
        list.family.adopt(contentItem(c))
        list.class.add("filtered")
      }
      if (result === "pass"){
        list.family.adopt(contentItem(c))
      }
    }
  }

  return (
    div({class: "contents-list-view"})(
      search(),
      div({class: "tool-box"})(
        filter(listUpdate),
        sortTool(),
        checker()
      ),
      sul().class.add("contents-list")
    )
  )
}

function filter(listUpdate:()=>void){
  const filterBox = div({class: "filter-box"})()
  const addFilter = ()=>{
    filterBox.family.adopt(new FilterItem(listUpdate, data))
    listUpdate()
  }
  return (
    new WDetail(
      btn("Filter"),
      div({class: "filter"})(
        btn("add filter")
          .class.add("add-filter-button")
          .input.onclick(addFilter),
        filterBox
      )
    )
  )
}
class Search extends WContainer {
  constructor(){
    super();
    this.family.adoptAll(
      
    )
  }
}
function test(content:Content):"pass"|"omit"|"spoil"{
  const filters = filterBox.family.children as FilterItem[];
  const tests = filters.map(f => f.test(content))
  
  if (tests.includes("omit")) return "omit"
  if (tests.includes("spoil")) return "spoil"
  
  return "pass";
}