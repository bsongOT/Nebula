import { WebObject } from "../WebObject";
import { DOMObject } from "../DOMObject";
import { WInput } from "./WInput";
import { WText } from "../WText"
import { EventQueue } from "@/factors/Event";

export class SimpleRadio extends WInput{
  public get name(){
    return this.element.name;
  }
  public set name(v:string){
    this.element.name = v;
  }
  public get checked():boolean{
    return this.element.checked;
  }
  public set checked(v){
    this.element.checked = v;
  }
  constructor(name:string){
    super()
    this.element.type = "radio";
    this.element.name = name;
  }
}
export class WRadio extends DOMObject<"div">{
  private $radio:SimpleRadio;
  private $label:WText|undefined;
  public get checked(){
    return this.$radio.checked;
  }
  public set checked(v:boolean){
    this.$radio.checked = v;
  }
  constructor(name: string){
    super("div")
    this.$radio = new SimpleRadio(name);
    this.class.add("radio")
    this.$radio.events.change.register(()=>{
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
    this.checked = true;
    return this;
  }
}