import { DOMObject } from "./DOMObject";
import "../styles/HyperLink.css"
import { Family } from "@/factors/Family";
import { HTMLObject } from "./HTMLObject";

export class WHyperLink extends DOMObject<"a">{
  public readonly family!: Family<never, HTMLObject, this>;

  constructor(text:string, path:string){
    super("a")
    this.element.href = path;
    this.element.innerText = text;
  }
}