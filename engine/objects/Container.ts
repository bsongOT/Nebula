import { DOMObject } from "./WebObject"

export abstract class AbstractContainer extends DOMObject{
  public abstract readonly components: Record<string, DOMObject>;
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