import { DOMObject, WebObject } from "../WebObject";
import { WInput } from "./WInput";
import { WText } from "../WText"
import { DOMFamily, HTMLFamily } from "@/factors/families/DOMFamily";
import { EventQueue } from "@/factors/events/Event";
import { NeverOccuredEvent } from "@/factors/events/NeverOccurredEvent";

export class SimpleRadio extends WInput{
  public family!:DOMFamily<never, DOMObject, SimpleRadio>;
  public get name(){
    return this.element.name;
  }
  public set name(v:string){
    this.element.name = v;
  }
  public get checked():boolean{
    return this.element.checked;
  }
  constructor(name:string){
    super()
    this.element.type = "radio";
    this.element.name = name;
  }
}
export class WRadio extends DOMObject{
    public readonly family!: DOMFamily<DOMObject, DOMObject, WRadio>;
    public readonly event: NeverOccuredEvent<WRadio>;
    private $radio:SimpleRadio;
    private $label:WText|undefined;
    public get value(){return this.$radio.value;}
    public get checked(){
        return this.$radio.checked;
    }
    constructor(name: string){
        super("label")
        this.event = new NeverOccuredEvent()
        this.$radio = new SimpleRadio(name);
        this.class.add("radio")
        this.$radio.event.change.register(()=>{
          if (this.checked) this.class.add("checked")
          else this.class.remove("checked")
        })
    }
    public label(text:string){
      if (this.$label)
        this.$label.value = text;
      else
        this.$label = this.family.adopt(new WText(text))
      return this;
    }
    public check(){
      this.element.click()
      return this;
    }
}