import {WebObject} from "./WebObject"
import {ChangableObjectOption} from "../types"

export class StateBox extends WebObject<WebObject<any,any>,WebObject<any,any>> {
  public get value(): string {
    return this.element.innerText;
  }
  protected set value(v:string){
    this.element.innerText = v;
  }
  private states:string[];
  private displayingIndex:number;
  protected option:ChangableObjectOption;
  get index():number{
    return this.displayingIndex;
  }
  set index(v){
    if (isNaN(v)) return;
    this.displayingIndex = v % this.states.length;
    this.value = this.state;
    this.option?.onchange?.()
  }
  get state(){
    return this.states[this.index]
  }
  constructor(option:ChangableObjectOption, states:string[]){
    super("span", {class: "statebox"});
    this.states = states;
    this.index = 0;
  }
  click(){
    this.index++;
  }
}