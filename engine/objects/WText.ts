import { Family } from "@/factors/Family";
import { DOMObject } from "./DOMObject";
import { HTMLObject } from "./WebObject";

export class WText extends DOMObject<"span">{
  public readonly family!: Family<never, HTMLObject, this>
  public get value(): string {
    return this.element.innerText;
  }
  public set value(v: string) {
    this.element.innerText = v;
  }
  constructor(text:string){
    super("span");
    this.value = text;
  }
}