import {StateBox} from "../../"
import {Filter} from "../"
import {Search} from "../"

const filterModes = ["omit", "spoil"];
export class FilterMode extends StateBox{
  filter:Filter|Search;
  constructor(filter:Filter|Search){
    super({}, filterModes);
    this.addClass("filter-mode")
    this.filter = filter;
  }
  click(){
    super.click()
    this.filter.change()
  }
}