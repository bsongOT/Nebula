import {StateBox} from "@/objects"
import {Filter} from "../"
import {Search} from "../"

export const filterModes = ["omit", "spoil"];
export class FilterMode extends StateBox{
  constructor(filter:Filter|Search){
    super(filterModes);
    this.class.add("filter-mode")
    this.event.onchange(()=>filter.event.change.invoke())
  }
}