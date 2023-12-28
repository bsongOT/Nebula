import { Family } from "@/factors/Family";
import { HTMLObject, WText } from "..";
import { WInput } from "./WInput";
import { DOMObject } from "../DOMObject";

export class WSimpleCheckbox extends WInput{
  public get checked(){
    return this.element.checked;
  }
  constructor(){
    super()
    this.element.type = "checkbox";
  }
}
export class WCheckbox extends DOMObject{
  public get value():string{
    return this.$checkbox.value;
  }
  public set value(v: string) {
    this.$checkbox.value = v;
  }
  public get checked(){
    return this.$checkbox.checked;
  }
  private $checkbox:WSimpleCheckbox;
  private $label:WText|undefined;
  constructor(){
    super("label")
    this.$checkbox = new WSimpleCheckbox();
    this.class.add("checkbox")
    this.$checkbox.change.register(()=>{
      if (this.checked) this.class.add("checked")
      else this.class.add("checked")
    })
  }
  public label(text:string){
    if (!this.$label)
      this.$label = this.family.adopt(new WText(text));
    else
      this.$label.value = text;

    return this;
  }
}