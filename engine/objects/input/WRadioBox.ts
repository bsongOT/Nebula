import { DOMObject } from "../DOMObject";
import { WRadio } from "./WRadio";
import "../../styles/RadioBox.css"
import { Family } from "@/factors/Family";
import { HTMLObject } from "../WebObject";

export class WRadioBox extends DOMObject<"div">{
  public readonly family!:Family<WRadio, HTMLObject, this>
  public get selectedRadio() {
    return this.family.children.find(r => r.checked)
  }
  constructor(children:WRadio[]){
    super("div")
    this.family.adoptAll(children)
    this.class.add("radio-box")
  }
}