import { DOMObject } from "./DOMObject"
import "../styles/Navigator.css"
import { Family } from "@/factors/Family"
import { HTMLObject } from "./HTMLObject"

export class WNavigator extends DOMObject<"nav">{
  public readonly family!:Family<DOMObject<any>, HTMLObject, this>
  constructor(){
    super("nav")
  }
}