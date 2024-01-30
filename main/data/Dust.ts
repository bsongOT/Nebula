import { DataComponent } from "./DataComponent";

export class Dust implements DataComponent{
  public text:string;
  public figurePath:string;
  public id:number;

  constructor(text:string, figurePath:string, id:number){
    this.text = text;
    this.figurePath = figurePath;
    this.id = id;
  }
  public pack() {
    throw new Error("Method not implemented.");
  }
  public static load(obj:any){
    return new Dust(obj.text, obj.figurePath, obj.id)
  }
}