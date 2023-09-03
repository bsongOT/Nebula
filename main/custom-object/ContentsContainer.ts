import {ContentsList, Search, Filter, SortTool, Checker, ContentItem}
from "./ContentsContainer/"
import {Container} from "./"
import { Content } from "../data/Data";

export class ContentsContainer extends Container{
  private contentsList:ContentsList;
  public get selection():ContentItem{
    return this.contentsList.selection;
  }
  constructor(option:{contents:Content[]}){
    super({class: "contents-container"});
    [
      new Search({onchange: ()=>this.update()}),
      new Filter({onchange: ()=>this.update()}),
      new SortTool(),
      new Checker(),
      this.contentsList = new ContentsList({contents: option.contents})
    ].forEach(e => this.adopt(e))
  }
  public update():ContentsContainer{
    this.contentsList.update();
    return this;
  }
}