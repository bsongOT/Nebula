import { DOMObject } from "./DOMObject";
import { WSelectMenu } from ".";
import { Family } from "@/factors/Family";

export class WOption<T> extends DOMObject<"option">{
  public readonly family!: Family<never, WSelectMenu<T>, this>;
  public get text(): string {
    return this.element.innerText;
  }
  public set text(v: string) {
    this.element.innerText = v;
  }
  public get disabled():boolean{
    return this.element.disabled;
  }
  public set disabled(v:boolean){
    this.element.disabled = v;
  }
  public data:T|undefined;

  get selected(){
    return this.element.selected
  }
  set selected(v){
    this.element.selected = v;
  }
  constructor(text:string, data?:T){
    super("option");
    this.text = text;
    this.data = data;
  }
}