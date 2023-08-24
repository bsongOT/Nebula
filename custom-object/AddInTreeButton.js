import {ButtonObject} from "../objects/index.js"

export class AddInTreeButton extends ButtonObject {
  from;
  to;
  constructor(from, to){
    super("+");
    this.from = from;
    this.to = to;
  }
  click(){
    super.click()
    this.to.add(this.from.selection.content)
  }
}