import {SelectableList} from "@/objects/list/"
import {ContentItem, Filter, Search} from "../"
import {Content} from "../../../data/Data"
import { DataCollection } from "../../../data/DataCollection";

export class ContentsList extends SelectableList<Content>{
  private contents:DataCollection<Content>
  private search:Search|undefined;
  private filter:Filter|undefined;
  public constructor(contents:DataCollection<Content>){
    super([])
    this.class.add("contents-list")
    this.contents = contents;
  }
  public setSearch(search:Search){
    this.search = search;
    return this;
  }
  public setFilter(filter:Filter){
    this.filter = filter;
    return this;
  }
  public update(){
    this.family.empty();

    for (let c of this.contents.all()){
      let spoiled = false;
      
      if (this.search){
        const sm = this.search.mode;

        if (!this.search.test(c)){
          if (sm === "omit") continue;
          if (sm === "spoil") spoiled = true;
        }
      }
      
      if (this.filter){
        const fr = this.filter.test(c)

        if (fr !== true){
          if (fr === "omit") continue;
          if (fr === "spoil") spoiled = true;
        }
      }
      
      const item = this.adopt(new ContentItem(c))
      if (spoiled) item.class.add("filtered")
    }
    return this;
  }
}