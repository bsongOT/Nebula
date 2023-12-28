import { Class } from "@/factors/Class";
import { HTMLObject } from "./WebObject";
import { Style } from "@/factors/Style";

export abstract class DOMObject extends HTMLObject {
  protected readonly element: HTMLElement;
  public readonly class: Class<this>;
  public readonly style: Style;
  constructor(tag?:keyof HTMLElementTagNameMap) {
    super();
    this.element = document.createElement(tag ?? "div");
    this.class = Class.new(this, this.element);
    this.style = Style.new(this.element)
    this.initInput();
  }
}
