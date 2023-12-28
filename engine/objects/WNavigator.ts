import { DOMObject } from "./DOMObject"
import "../styles/Navigator.css"
import { Family } from "@/factors/Family"
import { HTMLObject } from "./WebObject"

export class WNavigator extends DOMObject{
  public readonly family!:Family<DOMObject, HTMLObject, this>
  constructor(){
    super("nav")
  }
}