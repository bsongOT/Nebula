import {ContentsList, Search, SortTool, Checker, ContentItem}
from "."
import { WContainer, WDetail } from "@/objects/"
import { Content } from "../../data/Data";
import { DataCollection } from "../../data/DataCollection";
import "../../styles/ContentsContainer.css"
import "../../styles/Tool-box.css"
import { btn, div } from "@/funcObject";

function filter(){
  return (
    new WDetail(
      btn("Filter"),
      div(
        btn("add filter")
          .class.add("add-filter-button")
          .input.onclick(listUpdate),
        div().class.add("filter-box")
      )
    ).class.add("filter")
  )
}
function test(content:Content):boolean|string{
  const filters = this.box.family.children as FilterItem[];
  let spoiled = false;
  
  for (let f of filters){
    const m = f.mode;

    if (f.test(content)) continue;
    if (m === "omit") return "omit"
    if (m === "spoil") spoiled = true;
  }
  
  return spoiled ? "spoil" : true;
}
  
  div(
    new Search().onchange(listUpdate),
    div(
      filter().event.onchange(listUpdate),
      new SortTool(),
      new Checker(),
    ).class.add("contents-container-tool-box"),
    new ContentsList(contents).setSearch(s).setFilter(f)
  ).class.add("contents-container")

function listUpdate(){

}