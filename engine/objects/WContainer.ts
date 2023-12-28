import { Family } from "@/factors/Family";
import { DOMObject } from "./DOMObject";
import { HTMLObject } from "./WebObject";

export abstract class AbstractContainer extends DOMObject{
  public abstract readonly components: Record<string, DOMObject>;
  public readonly family!: Family<DOMObject, HTMLObject, this>;
  protected constructor(){
    super("div")
  }
}
export class WContainer extends AbstractContainer{
  public readonly components: Record<string, DOMObject>;
  constructor(){
    super();
    this.class.add("container");
    this.components = {};
  }
}