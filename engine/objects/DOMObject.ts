import { Class } from "@/factors/Class";
import { HTMLObject } from "./WebObject";
import { Style } from "@/factors/Style";

export abstract class DOMObject<T extends keyof HTMLElementTagNameMap> extends HTMLObject {
  protected readonly element: HTMLElementTagNameMap[T];
  public readonly class: Class<this>;
  public readonly style: Style;
  constructor(tag:T) {
    super();
    this.element = document.createElement(tag);
    this.class = Class.new(this, this.element);
    this.style = Style.new(this.element)
  }
}
