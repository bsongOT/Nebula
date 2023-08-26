import {ButtonObject} from "../objects/index.js"
import {contents} from "../../data/Data.js"

export class RemoveContentButton extends ButtonObject{
  #onremoved;
  target;
  constructor(option){
    super("🗑");
    this.target = option.target;
    this.#onremoved = option.onremoved;
  }
  click() {
    super.click();
    
    if (!this.target) return;
    contents.splice(contents.indexOf(this.target), 1)
    
    this.#onremoved?.()
  }
}