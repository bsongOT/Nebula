import {SelectableList} from "../"
import {ContentItem} from "./"
import {ContentsListOption} from "../../types"
import {Content} from "../../data/Data"

export class ContentsList extends SelectableList<Content>{
  protected option:ContentsListOption;
  public constructor(option:ContentsListOption){
    super(option, [])
    this.addClass("contents-list")
    this.update()
  }
  public update(){
    this.empty();

    for (let c of this.option.contents){
      let spoiled = false;
      
      if (this.option.search){
        const sm = this.option.search.mode;

        if (!this.option.search.test(c)){
          if (sm === "omit") continue;
          if (sm === "spoil") spoiled = true;
        }
      }
      
      if (this.option.filter){
        const fr = this.option.filter.test(c)

        if (fr !== true){
          if (fr === "omit") continue;
          if (fr === "spoil") spoiled = true;
        }
      }
      
      const item = this.adopt(new ContentItem(c))
      if (spoiled) item.addClass("filtered")
    }
  }
}