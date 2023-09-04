import {WebObject} from "./WebObject"

export class InputObject extends WebObject<never,WebObject<any,any>>{
  protected element:HTMLInputElement
  public constructor(){
    super("input");
  }
  public onchange(onchange:()=>void){
    this.element.onchange = onchange;
    return this;
  }
  public ontyping(ontyping:()=>void){
    this.element.oninput = ontyping;
    return this;
  }
  public setValue(v:string){
    this.value = v;
    return this;
  }
  public setType(t:string){
    this.element.type = t;
    if (t === "number") this.value = "0";
    return this;
  }
  get value():string {
    return this.element.value;
  }
  set value(value) {
    this.element.value = value;
  }
}