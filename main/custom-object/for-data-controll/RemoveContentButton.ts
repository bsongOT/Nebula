import {ButtonObject} from "../"
import {Content, data} from "../../data/Data.js"

export class RemoveContentButton extends ButtonObject{
  public target:Content|undefined;
  public constructor(target?:Content){
    super("🗑");
    this.target = target;
    this.onclick(()=>{})
  }
  public onclick(onclick:()=>void) {
    super.onclick(()=>{
      if (!this.target) return;
      data.removeContent(this.target)
      onclick()
    })
    
    return this;
  }
}