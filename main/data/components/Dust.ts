import { DataComponent } from "./DataComponent";

export class Dust implements DataComponent{
  public claim:string;
  public kernelPath:string;
  public id:number;

  constructor(info?:{
    claim?:string,
    kernelPath?:string,
    id?:number
  }){
    this.claim = info?.claim ?? "";
    this.kernelPath = info?.kernelPath ?? "";
    this.id = info?.id ?? -1;
  }
}