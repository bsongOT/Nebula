import { DataComponent } from "./DataComponent";

export class Dust implements DataComponent{
  public claim:string;
  public kernelPath:string;
  public id:number;

  constructor(info?:{
    claim?:string,
    kernelPath?:string
  }){
    this.claim = info?.claim ?? "";
    this.kernelPath = info?.kernelPath ?? "";
    this.id = -1;
  }
}