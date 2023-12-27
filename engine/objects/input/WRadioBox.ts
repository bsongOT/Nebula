import { DOMObject } from "../WebObject";
import { WRadio } from "./WRadio";
import "../../styles/RadioBox.css"
import { DOMFamily } from "@/factors/families/DOMFamily";
import { NeverOccuredEvent } from "@/factors/events/NeverOccurredEvent";

export class WRadioBox extends DOMObject{
  public readonly event:NeverOccuredEvent<WRadioBox>;
  public readonly family!:DOMFamily<WRadio, DOMObject, WRadioBox>
  public get value() {
    return this.family.children.find(r => r.checked)
  }
  constructor(children?:WRadio[]){
    super("div")
    this.event = new NeverOccuredEvent()
    this.family.adoptAll(children)
    this.class.add("radio-box")
  }
}