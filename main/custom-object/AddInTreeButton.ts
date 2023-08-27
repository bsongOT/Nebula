import {ButtonObject} from "./index"
import {ContentsContainer, TOCContainer} from "./index"

export class AddInTreeButton extends ButtonObject {
  from:ContentsContainer;
  to:TOCContainer;
  constructor(from:ContentsContainer, to:TOCContainer){
    super("+");
    this.from = from;
    this.to = to;
  }
  click(){
    super.click()
    this.to.add(this.from.selection.content)
  }
}