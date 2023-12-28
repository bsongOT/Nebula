import { DOMObject } from "./DOMObject";
import "../styles/StateBox.css"
import { Family } from "@/factors/Family";
import { EventQueue } from "@/factors/Event";

export class WStateBox extends DOMObject {
  public readonly family!: Family<never, DOMObject, this>;
  public readonly change:EventQueue<()=>void>;
  public get value(): string {
    return this.element.innerText;
  }
  protected set value(v:string){
    this.element.innerText = v;
  }
  private states:string[];
  private $index:number = 0;
  get index():number{
    return this.$index;
  }
  set index(v){
    if (isNaN(v)) return;
    this.$index = v % this.states.length;
    this.value = this.state;
    this.change.invoke()
  }
  get state(){
    return this.states[this.index]
  }
  constructor(states:string[]){
    super("span");
    this.class.add("state-box");
    this.change = new EventQueue();
    this.states = states;
    this.index = 0;
    this.input.click.register(()=>{
      this.index++;
    })
  }
}