import {WebObject} from "./WebObject.js"

export class StateBox extends WebObject {
  #states;
  #index;
  #onchange;
  get index(){
    return this.#index;
  }
  set index(v){
    if (isNaN(v)) return;
    this.#index = v % this.#states.length;
    this.value = this.state;
    this.#onchange?.()
  }
  get state(){
    return this.#states[this.index]
  }
  constructor(option, states){
    super("span", {class: "statebox"});
    this.#onchange = option.onchange;
    this.#states = states;
    this.index = 0;
  }
  click(){
    this.index++;
  }
}