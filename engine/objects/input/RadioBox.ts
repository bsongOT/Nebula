import { WebObject } from "../WebObject";
import { Radio } from "./Radio";
import "../../styles/RadioBox.css"

export class RadioBox extends WebObject<Radio, any>{
  public get value() {
    return this.children.find(r => r.checked)
  }
  constructor(children?:Radio[]){
    super("div", children)
    this.addClass("radio-box")
  }
}