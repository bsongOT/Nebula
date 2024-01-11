import { Family } from "@/factors/Family";
import { DOMObject } from "./DOMObject";
import { HTMLObject } from "./WebObject";

export abstract class AbstractContainer extends DOMObject<"div">{
  public abstract readonly components: Record<string, DOMObject<any>>;
  public readonly family!: Family<DOMObject<any>, HTMLObject, this>;
  protected constructor(){
    super("div")
  }
}
export class WContainer extends AbstractContainer{
  public readonly components: Record<string, DOMObject<any>>;
  constructor(){
    super();
    this.class.add("container");
    this.components = {};
  }
}