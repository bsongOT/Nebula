import { DOMObject } from "./DOMObject";
import "../styles/StateBox.css"
import { Family } from "@/factors/Family";
import { EventQueue } from "@/factors/Event";
import { HTMLObject } from "./WebObject";

export class WStateBox extends DOMObject<"span"> {
  public readonly family!: Family<never, HTMLObject, this>;
  public readonly change:EventQueue<()=>void>;
  public get value(): string {
    return this.element.innerText;
  }
  protected set value(v:string){
    this.element.innerText = v;
  }
  private states:string[];
  private $index:number = 0;
  public get index(){
    return this.$index;
  }
  public set index(v){
    if (isNaN(v)) return;
    this.$index = v % this.states.length;
    this.value = this.state;
    this.change.invoke()
  }
  public get state(){
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