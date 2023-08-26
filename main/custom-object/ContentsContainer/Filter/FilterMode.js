import {StateBox} from "../../../objects/index.js"

const filterModes = ["omit", "spoil"];
export class FilterMode extends StateBox{
  filter;
  constructor(filter){
    super({}, filterModes);
    this.addClass("filter-mode")
    this.filter = filter;
  }
  click(){
    super.click()
    this.filter.change()
  }
}