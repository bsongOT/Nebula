import {WebObject} from "./WebObject"
import {ChangableObjectOption} from "../types"

export class StateBox extends WebObject {
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