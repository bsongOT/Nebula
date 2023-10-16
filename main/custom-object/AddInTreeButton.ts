import {ButtonObject} from "@/objects/"
import {ContentsContainer, StarListContainer} from "./"

export class AddInTreeButton extends ButtonObject {
  private from:ContentsContainer;
  private to:StarListContainer;
  constructor(){
    super("+");
    this.onclick(()=>{
      this.to.add(this.from.selection.value)
    })
  }
  public ready(from:ContentsContainer, to:StarListContainer){
    this.from = from;
    this.to = to;
    return this;
  }
}