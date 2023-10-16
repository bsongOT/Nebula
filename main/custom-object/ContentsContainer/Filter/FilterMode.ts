import {StateBox} from "@/objects"
import {Filter} from "../"
import {Search} from "../"

export const filterModes = ["omit", "spoil"];
export class FilterMode extends StateBox{
  private filter:Filter|Search;
  constructor(filter:Filter|Search){
    super(filterModes);
    this.addClass("filter-mode")
    this.filter = filter;
    this.onchange(()=>filter.update())
  }
}