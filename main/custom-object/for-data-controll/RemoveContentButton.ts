import {ButtonObject} from "@/objects"
import {Content, data} from "../../data/Data"

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
      data.contents.remove(this.target.id)
      onclick()
    })
    
    return this;
  }
}