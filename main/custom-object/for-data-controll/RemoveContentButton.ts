import { WButton } from "@/objects"
import {Content, data} from "../../data/Data"

export class RemoveContentButton extends WButton{
  public target:Content|undefined;
  public constructor(target?:Content){
    super("🗑");
    this.target = target;
    this.event.click.register(()=>{
      if (!this.target) return;
      data.contents.remove(this.target.id)
    })
    this.event.click.register(()=>{})
  }
}