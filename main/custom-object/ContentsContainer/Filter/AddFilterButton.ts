import {ButtonObject} from "../../"
import {Filter} from "../"

export class AddFilterButton extends ButtonObject{
  filter:Filter;
  constructor(filter:Filter){
    super("add filter");
    this.filter = filter;
  }
  click(){
    super.click()
    this.filter.add()
    this.filter.change()
  }
}