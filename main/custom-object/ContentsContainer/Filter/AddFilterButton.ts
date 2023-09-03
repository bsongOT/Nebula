import {ButtonObject} from "../../"
import {Filter} from "../"

export class AddFilterButton extends ButtonObject{
  private filter:Filter;
  constructor(filter:Filter){
    super("add filter");
    this.filter = filter;
  }
  protected click(){
    super.click()
    this.filter.add()
  }
}