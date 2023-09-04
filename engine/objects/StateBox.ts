import {WebObject} from "./WebObject"

export class StateBox extends WebObject<WebObject<any,any>,WebObject<any,any>> {
  public get value(): string {
    return this.element.innerText;
  }
  protected set value(v:string){
    this.element.innerText = v;
  }
  private states:string[];
  private $index:number;
  get index():number{
    return this.$index;
  }
  set index(v){
    if (isNaN(v)) return;
    this.$index = v % this.states.length;
    this.value = this.state;
    this.$onchange?.()
  }
  get state(){
    return this.states[this.index]
  }
  private $onchange:()=>void;
  constructor(states:string[]){
    super("span");
    this.addClass("statebox");
    this.states = states;
    this.index = 0;
    this.onclick(()=>{})
  }
  public onchange(onchange:()=>void){
    this.$onchange = onchange;
    return this;
  }
  public onclick(onclick:()=>void){
    this.element.onclick = ()=>{
      this.index++;
      onclick()
    }
    return this;
  }
}