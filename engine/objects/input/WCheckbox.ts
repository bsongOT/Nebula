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
export class WCheckbox extends DOMObject<"div">{
  public get checked(){
    return this.$checkbox.checked;
  }
  private $checkbox:WSimpleCheckbox;
  private $label:WText|undefined;
  constructor(){
    super("div")
    this.$checkbox = new WSimpleCheckbox();
    this.class.add("checkbox")
  }
  public label(text:string){
    if (!this.$label){
      this.$label = this.family.adopt(new WText(text));
      return this;
    }
    this.$label.value = text;
    return this;
  }
}