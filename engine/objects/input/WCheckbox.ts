import { DOMObject, WText } from "..";
import { WInput } from "./WInput";
import { Classifier } from "@/factors/class/Classifier";
import { InputEventInvoker } from "@/factors/events/InputEventInvoker";
import { NeverOccuredEvent } from "@/factors/events/NeverOccurredEvent";
import { DOMFamily } from "@/factors/families/DOMFamily";

export class WSimpleCheckbox extends WInput{
  public family!: DOMFamily<never, DOMObject, WSimpleCheckbox>;
  public readonly event!: InputEventInvoker<WSimpleCheckbox>;
  public get checked(){
    return this.element.checked;
  }
  constructor(){
    super()
    this.element.type = "checkbox";
  }
}
export class WCheckbox extends DOMObject{
  public readonly family!:DOMFamily<DOMObject, DOMObject, this>
  public readonly event: NeverOccuredEvent<WCheckbox>
  public readonly class!: Classifier<this>
  public get value():string{
    return this.$checkbox.value;
  }
  public set value(v: string) {
    this.$checkbox.value = v;
  }
  public get checked(){
    return this.$checkbox.checked;
  }
  private $checkbox:WSimpleCheckbox;
  private $label:WText|undefined;
  constructor(){
    super("label")
    this.$checkbox = new WSimpleCheckbox();
    this.class.add("checkbox")
    this.event = new NeverOccuredEvent();
    this.$checkbox.event.change.register(()=>{
      if (this.checked) this.class.add("checked")
      else this.class.add("checked")
    })
    this.$checkbox.event.change.register(()=>{})
  }
  public label(text:string){
    if (!this.$label)
      this.$label = this.family.adopt(new WText(text));
    else
      this.$label.value = text;

    return this;
  }
}