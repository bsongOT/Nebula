import {ContentsList, Search, Filter, SortTool, Checker, ContentItem}
from "."
import {Container} from "@/objects/"
import { Content } from "../../data/Data";
import { DataCollection } from "../../data/DataCollection";
import "../../styles/ContentsContainer.css"
import "../../styles/Tool-box.css"

export class ContentsContainer extends Container{
  private contentsList:ContentsList;
  public get selection():ContentItem{
    return this.contentsList.selection;
  }
  constructor(contents:DataCollection<Content>){
    super();
    let search:Search;
    let filter:Filter;
    this.addClass("contents-container");
    [
      search = new Search().onchange(()=>this.update()),
      new Container([
        filter = new Filter().onchange(()=>this.update()),
        new SortTool(),
        new Checker(),
      ]).addClass("contents-container-tool-box"),
      this.contentsList = new ContentsList().ready(contents).setSearch(search).setFilter(filter)
    ].forEach(e => this.adopt(e))
  }
  public update():ContentsContainer{
    this.contentsList.update();
    return this;
  }
  public onselect(onselect:()=>void){
    this.contentsList.onselect(onselect);
    return this;
  }
}