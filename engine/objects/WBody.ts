import { HTMLObject } from "./WebObject"
import { DOMObject } from "./DOMObject";
import "../styles/all.css"
import { Family } from "@/factors/Family";
import { Class } from "@/factors/Class";
import { Style } from "@/factors/Style";

export class WBody extends HTMLObject{
  public class: Class<this>;
  public style: Style;
  protected readonly element:HTMLElement;
  public readonly family!: Family<DOMObject, never, this>;
  constructor(children:DOMObject[]){
    super();
    this.element = document.body;
    this.class = Class.new(this, this.element);
    this.style = Style.new(this.element)
    this.family.adoptAll(children)
  }
}