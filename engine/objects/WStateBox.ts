import { DOMObject } from "./WebObject"
import { EventInvoker } from "@/factors/events/Event";
import { DOMFamily } from "@/factors/families/DOMFamily";
import "../styles/StateBox.css"

export class WStateBox extends DOMObject {
  public family!: DOMFamily<never, DOMObject, WStateBox>;
  public event!: EventInvoker<WStateBox>;
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
    this.event.change.invoke()
  }
  get state(){
    return this.states[this.index]
  }
  public static new(states:string[]){
    const sb = new WStateBox(states)
    
    sb.family = new DOMFamily<never, DOMObject, WStateBox>(sb, sb.element),
    sb.event = new EventInvoker<WStateBox>(sb, sb.element)
    sb.init()
    
    return sb;
  }
  protected constructor(states:string[]){
    super("span");
    this.class.add("state-box");
    this.states = states;
  }
  protected init(){
    super.init()
    this.index = 0;
    this.event.click.register(()=>{
      this.index++;
    })
  }
}