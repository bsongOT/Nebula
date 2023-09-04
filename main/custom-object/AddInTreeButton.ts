import {ButtonObject} from "./index"
import {ContentsContainer, StarListContainer} from "./index"

export class AddInTreeButton extends ButtonObject {
  private from:ContentsContainer;
  private to:StarListContainer;
  constructor(from:ContentsContainer, to:StarListContainer){
    super("+");
    this.from = from;
    this.to = to;
    this.onclick(()=>{
      this.to.add(this.from.selection.value)
    })
  }
}