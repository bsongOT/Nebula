import {ContentsList} from "./ContentsContainer/ContentsList"
import {Container} from "./"

export class ContentsContainer extends Container{
  contentsList:ContentsList;
  search:Search;
  filter:Filter;
  sort:SortTool;
  checker:Checker;
  public get selection(){
    return this.contentsList.selection;
  }
  constructor(option){
    super({class: "contents-container", ...option}, [
      
    ]);

  }
  update(){
    this.contentsList?.update?.();
  }
}