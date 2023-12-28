import {ContentsList, Search, Filter, SortTool, Checker, ContentItem}
from "."
import { WContainer, WDetail } from "@/objects/"
import { Content } from "../../data/Data";
import { DataCollection } from "../../data/DataCollection";
import "../../styles/ContentsContainer.css"
import "../../styles/Tool-box.css"

function filter(){
  const filter = new WDetail()  
  filter
    .family.adoptAll([
      new WButton("Filter"),
      new WContainer().family.adoptAll([
        new WButton("add filter")
            .class.add("add-filter-button")
            .input.onclick(()=>this.add()),
  box=  new WContainer().class.add("filter-box")
      ])
    ])
    .class.add("filter");
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
export class ContentsContainer extends WContainer{
  private search:Search;
  private filter:Filter;
  private list:ContentsList;
  constructor(contents:DataCollection<Content>){
    let s:Search;
    let f:Filter;
    let l:ContentsList;
    super()
    this.family.adoptAll([
s=    new Search().onchange(()=>l.update()),
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