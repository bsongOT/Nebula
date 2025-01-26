import { DataComponent } from "./DataComponent";

export class Dust implements DataComponent{
  public claim:string;
  public id:number;

  constructor(info?:Partial<Dust>){
    this.claim = info?.claim ?? "";
    this.id = info?.id ?? -1;
  }
}