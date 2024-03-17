import { DataComponent } from "./DataComponent";

export class Dust implements DataComponent{
  public claim:string;
  public kernelPath:string;
  public id:number;

  constructor(){
    this.claim = "";
    this.kernelPath = "";
    this.id = -1;
  }
}