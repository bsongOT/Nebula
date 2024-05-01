import { UIManager } from "./UIManager";

export class UIUpdater extends UIManager {
  public readonly layout;
  public readonly element;
  public readonly info;

  constructor(element:HTMLElement, require:Record<string, () => any>){
    super()
    this.layout = {};
    this.element = element;
    this.info = require
    this.init()
  }
  
  public update(){
    for (const key in this.info){
        const data = this.info[key]();
        if ((this.element as any)[key] === data) continue;
        (this.element as any)[key] = this.info[key]();
    }
  }
  public detect(){
    return true;
  }
}