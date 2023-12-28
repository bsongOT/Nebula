import { DOMObject } from "../DOMObject";
import { WRadio } from "./WRadio";
import "../../styles/RadioBox.css"
import { Family } from "@/factors/Family";

export class WRadioBox extends DOMObject{
  public readonly family!:Family<WRadio, DOMObject, this>
  public get value() {
    return this.family.children.find(r => r.checked)
  }
  constructor(children:WRadio[]){
    super("div")
    this.family.adoptAll(children)
    this.class.add("radio-box")
  }
}