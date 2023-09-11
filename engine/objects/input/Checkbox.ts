import { WebObject, Text } from "..";
import { InputObject } from "./InputObject";

export class SimpleCheckbox extends InputObject{
  constructor(){
    super()
    this.element.type = "checkbox";
  }
}

export class Checkbox extends WebObject<WebObject<any,any>,WebObject<any,any>>{
  public get value():string{
    return this.$checkbox.value;
  }
  public set value(v: string) {
    this.$checkbox.value = v;
  }
  private $checkbox:SimpleCheckbox;
  private $label:Text|undefined;
  constructor(){
    let checkbox:SimpleCheckbox;
    super("label", [
      checkbox = new SimpleCheckbox()
    ])
    this.$checkbox = checkbox;
  }
  public label(text:string){
    if (!this.$label)
      this.$label = this.adopt(new Text(text));
    else
      this.$label.value = text;

    return this;
  }
}