import {ContentsList, Search, Filter, SortTool, Checker, ContentItem}
from "."
import { WContainer } from "@/objects/"
import { Content } from "../../data/Data";
import { DataCollection } from "../../data/DataCollection";
import "../../styles/ContentsContainer.css"
import "../../styles/Tool-box.css"

export class ContentsContainer extends WContainer{
  private search:Search;
  private filter:Filter;
  private list:ContentsList;
  constructor(contents:DataCollection<Content>){
    let s:Search;
    let f:Filter;
    let l:ContentsList;
    super([
s=    new Search().event.onchange(()=>l.update()),
      new WContainer([
f=    new Filter().event.onchange(()=>l.update()),
        new SortTool(),
        new Checker(),
      ]).class.add("contents-container-tool-box"),
l=    new ContentsList(contents).setSearch(s).setFilter(f)
    ]);
    this.class.add("contents-container")
    this.search = s;
    this.filter = f;
    this.list = l;
  }
  public useComponents(func:(components:{
    list?:ContentsList,
    search?:Search,
    filter?:Filter
  })=>void){
    func(this.components)
    return this;
  }
}