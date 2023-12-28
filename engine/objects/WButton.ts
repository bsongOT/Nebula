import { Family } from "@/factors/Family";
import { DOMObject } from "./DOMObject";
import { HTMLObject } from "./WebObject";

export class WButton extends DOMObject{
  public readonly family!: Family<DOMObject, HTMLObject, this>;
  constructor(name:string){
    super("button");
    this.element.innerText = name
  }
}