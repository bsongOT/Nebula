import { HTMLObject } from "./HTMLObject";
import "../styles/all.css"/*
import { Family } from "@/factors/Family";*/
import { Class } from "@/factors/Class";
import { Style } from "@/factors/Style";

export class WBody extends HTMLObject{
  private static $instance:WBody;
  public static get instance(){
    if (!WBody.$instance){
      WBody.$instance = new WBody()
    }
    return WBody.$instance;
  }
  public readonly class: Class<this>;
  public readonly style: Style;
  protected readonly element:HTMLElement;
  //public readonly family!: Family<DOMObject<any>, never, this>;
  private constructor(){
    alert(456)
    super();
    this.element = document.body;
    this.class = Class.new(this, this.element);
    this.style = Style.new(this.element)
  }
}