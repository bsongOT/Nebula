import { Tree } from "../../../engine/data-structure/tree"
import { Content } from "../Data";
import { DataComponent } from "./DataComponent";

export class Nebula implements DataComponent{
  id:number;
  name:string;
  tree:Tree<Content>;

  constructor(info?:Partial<Nebula>){
    this.name = info?.name ?? "Nebula";
    this.id = info?.id ?? -1;
    this.tree = info?.tree ?? new Tree()
  }
}

export class QueryCalculation {
  operator:"or" | "and" | "and not";
  nebula:Nebula;
  constructor(operator:"or"|"and"|"and not", nebula:Nebula){
    this.operator = operator;
    this.nebula = nebula
  }
}

export class QueryNebula {
  query:QueryCalculation[];
  constructor(info?:Partial<QueryNebula>){
    this.query = info?.query ?? []
  }
}