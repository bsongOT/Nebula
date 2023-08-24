import {ContentsList} from "./ContentsContainer/ContentsList.js"
import {Container} from "../objects/index.js"

export * from "./ContentsContainer/Search.js"
export * from "./ContentsContainer/Filter.js"
export * from "./ContentsContainer/SortTool.js"
export * from "./ContentsContainer/Checker.js"
export * from "./ContentsContainer/ContentsList.js"

export class ContentsContainer extends Container{
  contentsList;
  search;
  filter;
  sort;
  checker;
  contents;
  get selection(){
    return this.contentsList.selection;
  }
  constructor(option, children){
    super({class: "contents-container"}, children);
    this.contents = option.contents;
    this.contentsList = children.find(c => c instanceof ContentsList)
  }
  update(){
    this.contentsList?.update?.();
  }
}