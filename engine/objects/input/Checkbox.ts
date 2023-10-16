import { WebObject, Text } from "..";
import { InputObject } from "./InputObject";

export class SimpleCheckbox extends InputObject{
  public get checked(){
    return this.element.checked;
  }
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
  public get checked(){
    return this.$checkbox.checked;
  }
  private $checkbox:SimpleCheckbox;
  private $label:Text|undefined;
  constructor(){
    let checkbox:SimpleCheckbox;
    super("label", [
      checkbox = new SimpleCheckbox()
    ])
    this.$checkbox = checkbox;
    this.addClass("checkbox")
    this.onchange(()=>{})
  }
  public onchange(onchange:()=>void){
    this.$checkbox.onchange(()=>{
      if (this.checked) this.addClass("checked")
      else this.removeClass("checked")
      onchange()
    })
    return this;
  }
  public label(text:string){
    if (!this.$label)
      this.$label = this.adopt(new Text(text));
    else
      this.$label.value = text;

    return this;
  }
}