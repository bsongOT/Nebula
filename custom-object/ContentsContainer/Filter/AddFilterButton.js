import {ButtonObject} from "../../../objects/index.js"

export class AddFilterButton extends ButtonObject{
  filter;
  constructor(filter){
    super("add filter");
    this.filter = filter;
  }
  click(){
    super.click()
    this.filter.add()
    this.filter.change()
  }
}