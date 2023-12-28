import { Family } from "@/factors/Family";
import { DOMObject } from "./DOMObject";
import { HTMLObject } from "./WebObject";

export class WText extends DOMObject{
  public readonly family!: Family<never, HTMLObject, this>
  public get value(): string {
    return this.element.innerText;
  }
  public set value(v: string) {
    this.element.innerText = v;
  }
  constructor(text:string){
    super("span");
    this.class.add("text")
    this.value = text;
  }
}