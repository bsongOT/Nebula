import { WebObject } from ".";

export class Text extends WebObject<never, any>{
  public get value(): string {
    return this.element.innerText;
  }
  public set value(v: string) {
    this.element.innerText = v;
  }
  constructor(text:string){
    super();
    this.value = text;
  }
}