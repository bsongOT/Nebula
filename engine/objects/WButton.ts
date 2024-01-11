import { Family } from "@/factors/Family";
import { DOMObject } from "./DOMObject";
import { HTMLObject } from "./WebObject";

export class WSimpleButton extends DOMObject<"button">{
  public readonly family!: Family<never, HTMLObject, this>
  constructor(text:string){
    super("button")
    this.element.innerText = text;
  }
}
export class WButton extends DOMObject<"button">{
  public readonly family!: Family<DOMObject<any>, HTMLObject, this>;
  constructor(){
    super("button");
  }
}