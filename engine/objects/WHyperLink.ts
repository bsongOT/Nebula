import { DOMObject } from "./DOMObject";
import "../styles/HyperLink.css"
import { Family } from "@/factors/Family";
import { HTMLObject } from "./WebObject";

export class WHyperLink extends DOMObject{
  public readonly family!: Family<never, HTMLObject, this>;
  protected readonly element!: HTMLAnchorElement;
  public get value(){return this.element.href;}

  constructor(name:string, path:string){
    super("a")
    this.element.href = path;
    this.element.innerText = name;
  }
}