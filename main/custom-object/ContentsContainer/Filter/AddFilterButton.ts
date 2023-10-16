import {ButtonObject} from "@/objects"
import {Filter} from "../"

export class AddFilterButton extends ButtonObject{
  private filter:Filter;
  constructor(){
    super("add filter");
    this.onclick(()=>{
      throw "call ready() before using";
    })
  }
  public ready(filter:Filter){
    this.filter = filter;
    this.onclick(()=>{
      this.filter.add()
    })
  }
}