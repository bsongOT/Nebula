import {WebObject} from "./WebObject"

export class StateBox extends WebObject {
  private states:string[];
  private displayingIndex:number;
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
  constructor(option:WoOption, states:string[]){
    super("span", {class: "statebox"});
    this.states = states;
    this.index = 0;
  }
  click(){
    this.index++;
  }
}