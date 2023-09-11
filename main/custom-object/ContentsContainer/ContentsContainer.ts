import {ContentsList, Search, Filter, SortTool, Checker, ContentItem}
from "."
import {Container} from ".."
import { Content } from "../../data/Data";
import "../../styles/Tool-box.css"

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
      new Container([
        new Filter().onchange(()=>this.update()),
        new SortTool(),
        new Checker(),
      ]).addClass("contents-container-tool-box"),
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