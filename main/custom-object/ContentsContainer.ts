import {ContentsList, Search, Filter, SortTool, Checker, ContentItem}
from "./ContentsContainer/"
import {Container} from "./"
import { Content } from "../data/Data";

export class ContentsContainer extends Container{
  private contentsList:ContentsList;
  public get selection():ContentItem{
    return this.contentsList.selection;
  }
  constructor(contents:Content[]){
    super();
    this.addClass("contents-container");
    [
      new Search().onchange(()=>this.update()),
      new Filter().onchange(()=>this.update()),
      new SortTool(),
      new Checker(),
      this.contentsList = new ContentsList().ready(contents)
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