import { WebObject } from ".";

export class Text extends WebObject<never, any>{
  public get value(): any {
      throw new Error("Method not implemented.");
  }
  public set value(v: any) {
      throw new Error("Method not implemented.");
  }
  constructor(text:string){
    super();
    this.element.innerText = text;
  }
}