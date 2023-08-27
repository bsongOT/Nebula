import {SelectableList} from "../"
import {Filter, Search, ContentItem} from "./"
import {Content} from "../../data/Data"

export class ContentsList extends SelectableList{
  private filter:Filter;
  private search:Search;
  private contents:Content[];
  constructor(option){
    super(option, [])
    this.contents = option.contents;
    this.filter = option.filter;
    this.search = option.search;
    this.addClass("contents-list")
    this.update()
  }
  update(){
    this.empty();

    for (let c of this.contents){
      let spoiled = false;
      
      const sm = this.search.mode;
      if (!this.search.test(c)){
        if (sm === "omit") continue;
        if (sm === "spoil") spoiled = true;
      }
      
      const fr = this.filter.test(c)

      if (fr !== true){
        if (fr === "omit") continue;
        if (fr === "spoil") spoiled = true;
      }
      
      const item = this.adopt(new ContentItem(c))
      if (spoiled) item.addClass("filtered")
    }
  }
}