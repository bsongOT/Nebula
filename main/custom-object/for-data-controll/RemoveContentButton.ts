import {ButtonObject} from "../"
import {Content, data} from "../../data/Data.js"

export class RemoveContentButton extends ButtonObject{
  public target:Content;
  public constructor(option){
    super("🗑", option);
    this.target = option.target;
  }
  click() {
    super.click();
    
    if (!this.target) return;
    data.removeContent(this.target)
    
    this.option.onremoved?.()
  }
}