import { HTMLObject } from "./WebObject"
import { DOMObject } from "./DOMObject";
import "../styles/all.css"
import { Family } from "@/factors/Family";
import { Class } from "@/factors/Class";
import { Style } from "@/factors/Style";

export class WBody extends HTMLObject{
  public readonly class: Class<this>;
  public readonly style: Style;
  protected readonly element:HTMLElement;
  public readonly family!: Family<DOMObject<any>, never, this>;
  constructor(){
    super();
    this.element = document.body;
    this.class = Class.new(this, this.element);
    this.style = Style.new(this.element)
  }
}