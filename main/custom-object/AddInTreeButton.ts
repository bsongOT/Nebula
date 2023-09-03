import {ButtonObject} from "./index"
import {ContentsContainer, TOCContainer} from "./index"

export class AddInTreeButton extends ButtonObject {
  private from:ContentsContainer;
  private to:TOCContainer;
  constructor(from:ContentsContainer, to:TOCContainer){
    super("+");
    this.from = from;
    this.to = to;
  }
  protected click(){
    super.click()
    this.to.add(this.from.selection.value)
  }
}